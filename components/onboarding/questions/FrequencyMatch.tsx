"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Square, ArrowRight, Volume2 } from "lucide-react"

interface Props {
  value: number
  onChange: (val: number) => void
  onContinue: () => void
}

export function FrequencyMatch({ value, onChange, onContinue }: Props) {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.1) // 0 to 1
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  useEffect(() => {
    return () => {
      stopTone()
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (oscRef.current) {
      oscRef.current.frequency.setValueAtTime(value, audioCtxRef.current!.currentTime)
    }
  }, [value])

  useEffect(() => {
    if (gainRef.current && audioCtxRef.current) {
      // Small ramp to avoid clicks
      gainRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.05)
    }
  }, [volume])

  function playTone() {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume()
    }

    if (!oscRef.current) {
      oscRef.current = audioCtxRef.current.createOscillator()
      gainRef.current = audioCtxRef.current.createGain()

      oscRef.current.type = "sine"
      oscRef.current.frequency.setValueAtTime(value, audioCtxRef.current.currentTime)

      gainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime)
      gainRef.current.gain.linearRampToValueAtTime(volume, audioCtxRef.current.currentTime + 0.1)

      oscRef.current.connect(gainRef.current)
      gainRef.current.connect(audioCtxRef.current.destination)

      oscRef.current.start()
    }
    setPlaying(true)
  }

  function stopTone() {
    if (oscRef.current && gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.1)
      setTimeout(() => {
        if (oscRef.current) {
          oscRef.current.stop()
          oscRef.current.disconnect()
          oscRef.current = null
        }
        if (gainRef.current) {
          gainRef.current.disconnect()
          gainRef.current = null
        }
      }, 100)
    }
    setPlaying(false)
  }

  const logMin = Math.log(500)
  const logMax = Math.log(12000)
  const logVal = Math.log(value)

  const sliderPercent = ((logVal - logMin) / (logMax - logMin)) * 100

  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const pct = Number(e.target.value)
    const newLog = logMin + (pct / 100) * (logMax - logMin)
    const hz = Math.round(Math.exp(newLog))
    onChange(hz)
  }

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Frequency display */}
      <div className="text-center">
        <div className="font-serif text-6xl sm:text-7xl font-bold tabular-nums text-primary tracking-tight">
          {value.toLocaleString()} <span className="text-2xl text-foreground/40">Hz</span>
        </div>
      </div>

      {/* Main slider */}
      <div className="relative pt-6 pb-6">
        <input
          type="range"
          min={0} max={100} step={0.1}
          value={sliderPercent}
          onChange={handleSliderChange}
          className="w-full h-5 appearance-none rounded-full cursor-pointer bg-muted outline-none shadow-inner"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) ${sliderPercent}%, hsl(var(--muted)) ${sliderPercent}%)`,
          }}
        />
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-foreground/40 mt-4 px-1">
          <span>500 Hz</span>
          <span>12,000 Hz</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-6 bg-muted/50 p-6 rounded-3xl border border-border">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={playing ? stopTone : playTone}
          className={`flex-none w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md ${
            playing ? "bg-red-50 text-red-500 border border-red-200" : "bg-primary text-primary-foreground"
          }`}
        >
          {playing ? <Square className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </motion.button>

        <div className="flex-1 w-full flex items-center gap-4">
          <Volume2 className="w-5 h-5 text-foreground/40" />
          <input
            type="range"
            min={0} max={1} step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-2 appearance-none rounded-full bg-muted cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(var(--foreground)/0.4) ${volume * 100}%, hsl(var(--muted)) ${volume * 100}%)`,
            }}
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          stopTone()
          onContinue()
        }}
        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors mt-4"
      >
        Match & Continue <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  )
}
