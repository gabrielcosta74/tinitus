"use client"

import { useRef, useEffect } from "react"
import { TinniAudioEngine } from "@/lib/audio-engine"

interface WaveformProps {
  engine: TinniAudioEngine | null
  isActive: boolean
  className?: string
}

export function Waveform({ engine, isActive, className = "" }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx2d = canvas.getContext("2d")
    if (!ctx2d) return

    if (!engine || !isActive) {
      cancelAnimationFrame(rafRef.current)
      // Draw idle flat line
      ctx2d.clearRect(0, 0, canvas.width, canvas.height)
      ctx2d.strokeStyle = "rgba(13,148,136,0.3)"
      ctx2d.lineWidth = 1.5
      ctx2d.beginPath()
      ctx2d.moveTo(0, canvas.height / 2)
      ctx2d.lineTo(canvas.width, canvas.height / 2)
      ctx2d.stroke()
      return
    }

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)

      const W = canvas.width
      const H = canvas.height
      const freqData = engine.getFrequencyData()
      const binCount = freqData.length

      ctx2d.clearRect(0, 0, W, H)

      // Gradient fill under curve
      const grad = ctx2d.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, "rgba(13,148,136,0.25)")
      grad.addColorStop(1, "rgba(13,148,136,0)")

      ctx2d.beginPath()
      ctx2d.moveTo(0, H)

      const step = W / binCount
      for (let i = 0; i < binCount; i++) {
        const barH = (freqData[i] / 255) * H * 0.85
        ctx2d.lineTo(i * step, H - barH)
      }
      ctx2d.lineTo(W, H)
      ctx2d.closePath()
      ctx2d.fillStyle = grad
      ctx2d.fill()

      // Outline
      ctx2d.beginPath()
      ctx2d.moveTo(0, H)
      for (let i = 0; i < binCount; i++) {
        const barH = (freqData[i] / 255) * H * 0.85
        ctx2d.lineTo(i * step, H - barH)
      }
      ctx2d.strokeStyle = "rgba(13,148,136,0.7)"
      ctx2d.lineWidth = 1.5
      ctx2d.stroke()
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [engine, isActive])

  // Resize observer to keep canvas sharp
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      const ctx2d = canvas.getContext("2d")
      if (ctx2d) ctx2d.scale(window.devicePixelRatio, window.devicePixelRatio)
    })
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ imageRendering: "pixelated" }}
    />
  )
}
