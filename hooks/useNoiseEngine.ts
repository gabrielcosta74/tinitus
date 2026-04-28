"use client"

import { useEffect, useRef, useCallback } from "react"

type NoiseType = "pink" | "brown" | "white"

interface UseNoiseEngineOptions {
  noiseType: NoiseType
  enabled: boolean
  volume?: number // 0-1
}

/**
 * Web Audio API noise generator.
 * Generates pink / brown / white noise via an AudioBufferSourceNode loop.
 * Cleans up on unmount or when enabled flips to false.
 */
export function useNoiseEngine({ noiseType, enabled, volume = 0.35 }: UseNoiseEngineOptions) {
  const ctxRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  const stop = useCallback(() => {
    try {
      sourceRef.current?.stop()
    } catch {}
    sourceRef.current = null
    ctxRef.current?.close()
    ctxRef.current = null
  }, [])

  const start = useCallback(() => {
    if (typeof window === "undefined") return
    stop()

    const ctx = new AudioContext()
    ctxRef.current = ctx

    const bufferSize = ctx.sampleRate * 4 // 4-second buffer loops seamlessly
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    if (noiseType === "white") {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
    } else if (noiseType === "pink") {
      // Paul Kellett's pink noise approximation
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        b3 = 0.86650 * b3 + white * 0.3104856
        b4 = 0.55000 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.0168980
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) / 7
        b6 = white * 0.115926
      }
    } else {
      // Brown (red) noise — integrate white
      let last = 0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        last = (last + 0.02 * white) / 1.02
        data[i] = last * 3.5
      }
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.5) // fade in

    gainRef.current = gain
    sourceRef.current = source

    source.connect(gain)
    gain.connect(ctx.destination)
    source.start()
  }, [noiseType, volume, stop])

  useEffect(() => {
    if (enabled) {
      start()
    } else {
      // Fade out then stop
      if (gainRef.current && ctxRef.current) {
        gainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 0.8)
        setTimeout(stop, 900)
      } else {
        stop()
      }
    }
    return () => { stop() }
  }, [enabled, start, stop])

  const setVolume = useCallback((v: number) => {
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(v, ctxRef.current.currentTime + 0.3)
    }
  }, [])

  return { setVolume }
}
