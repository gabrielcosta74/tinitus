"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { TinniAudioEngine, SoundType } from "@/lib/audio-engine"

interface LayerState {
  type: SoundType | null
  volume: number
}

export interface AudioEngineControls {
  engine: TinniAudioEngine | null
  isReady: boolean
  layers: [LayerState, LayerState, LayerState]
  setLayer: (index: 0 | 1 | 2, type: SoundType | null, volume: number) => void
  setLayerVolume: (index: 0 | 1 | 2, volume: number) => void
  setMasterVolume: (vol: number) => void
  fadeIn: (sec: number) => void
  fadeOut: (sec: number, onDone?: () => void) => void
  suspend: () => void
  resume: () => void
}

export function useAudioEngine(notchHz?: number): AudioEngineControls {
  const engineRef = useRef<TinniAudioEngine | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [layers, setLayers] = useState<[LayerState, LayerState, LayerState]>([
    { type: null, volume: 0.5 },
    { type: null, volume: 0.5 },
    { type: null, volume: 0.5 },
  ])

  // Lazy-init engine on first interaction (respects AudioContext autoplay policy)
  function ensureEngine() {
    if (!engineRef.current) {
      engineRef.current = new TinniAudioEngine(notchHz)
      setIsReady(true)
    }
    return engineRef.current
  }

  // Suspend/resume on window blur/focus
  useEffect(() => {
    const onBlur = () => engineRef.current?.suspend()
    const onFocus = () => engineRef.current?.resume()
    window.addEventListener("blur", onBlur)
    window.addEventListener("focus", onFocus)
    return () => {
      window.removeEventListener("blur", onBlur)
      window.removeEventListener("focus", onFocus)
      engineRef.current?.destroy()
      engineRef.current = null
    }
  }, [])

  const setLayer = useCallback(
    (index: 0 | 1 | 2, type: SoundType | null, volume: number) => {
      const eng = ensureEngine()
      eng.setLayer(index, type, volume)
      setLayers((prev) => {
        const next = [...prev] as [LayerState, LayerState, LayerState]
        next[index] = { type, volume }
        return next
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notchHz]
  )

  const setLayerVolume = useCallback((index: 0 | 1 | 2, volume: number) => {
    engineRef.current?.setLayerVolume(index, volume)
    setLayers((prev) => {
      const next = [...prev] as [LayerState, LayerState, LayerState]
      next[index] = { ...next[index], volume }
      return next
    })
  }, [])

  const setMasterVolume = useCallback((vol: number) => {
    engineRef.current?.setMasterVolume(vol)
  }, [])

  const fadeIn = useCallback((sec: number) => {
    ensureEngine().fadeIn(sec)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fadeOut = useCallback((sec: number, onDone?: () => void) => {
    engineRef.current?.fadeOut(sec, onDone)
  }, [])

  const suspend = useCallback(() => engineRef.current?.suspend(), [])
  const resume = useCallback(() => engineRef.current?.resume(), [])

  return {
    engine: engineRef.current,
    isReady,
    layers,
    setLayer,
    setLayerVolume,
    setMasterVolume,
    fadeIn,
    fadeOut,
    suspend,
    resume,
  }
}
