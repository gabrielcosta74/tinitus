"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX, Pause, Play } from "lucide-react"
import type { SoundTherapyContent } from "@/types/session"
import { useNoiseEngine } from "@/hooks/useNoiseEngine"
import { useExerciseTimer } from "@/hooks/useExerciseTimer"

interface Props {
  content: SoundTherapyContent
  onComplete: () => void
}

const NOISE_LABELS: Record<string, string> = {
  pink: "Pink Noise",
  brown: "Brown Noise",
  white: "White Noise",
}

const NOISE_DESCRIPTIONS: Record<string, string> = {
  pink: "Balanced spectrum with warm low-mid frequencies — most similar to natural soundscapes.",
  brown: "Rich, deep rumble — like heavy rain or ocean waves. Highly effective for tinnitus masking.",
  white: "Full spectrum — bright and uniform. Best for high-frequency tinnitus masking.",
}

// Animated waveform bars
function WaveformBars({ active }: { active: boolean }) {
  const bars = [3, 7, 5, 9, 4, 8, 6, 10, 5, 7, 3, 6]
  return (
    <div className="flex items-center gap-1 h-12">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-primary"
          animate={active ? {
            scaleY: [0.3, 1, 0.3],
            opacity: [0.6, 1, 0.6],
          } : { scaleY: 0.15, opacity: 0.2 }}
          transition={{
            repeat: Infinity,
            duration: 1.2 + (i % 4) * 0.15,
            delay: i * 0.07,
            ease: "easeInOut",
          }}
          style={{ height: `${h * 3.5}px`, originY: "center" }}
        />
      ))}
    </div>
  )
}

export function SoundTherapyExercise({ content, onComplete }: Props) {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.35)
  const [muted, setMuted] = useState(false)

  const { setVolume: setEngineVolume } = useNoiseEngine({
    noiseType: content.noiseType,
    enabled: playing && !muted,
    volume,
  })

  const { remaining, progress, paused, start, pause, formatTime } = useExerciseTimer({
    durationSeconds: content.durationSeconds,
    onComplete,
    autoStart: false,
  })

  function handlePlay() {
    setPlaying(true)
    start()
  }

  function handlePause() {
    setPlaying(false)
    pause()
  }

  function handleVolumeChange(v: number) {
    setVolume(v)
    setEngineVolume(muted ? 0 : v)
  }

  function handleMute() {
    setMuted((m) => {
      setEngineVolume(!m ? 0 : volume)
      return !m
    })
  }

  const circumference = 2 * Math.PI * 64
  const strokeDash = circumference * (1 - progress)

  return (
    <div className="flex flex-col items-center justify-center h-full gap-10">
      {/* Instruction */}
      <p className="text-foreground/60 text-[15px] font-medium leading-relaxed text-center max-w-sm">{content.instruction}</p>

      {/* Timer ring */}
      <div className="relative flex items-center justify-center mt-2">
        <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
          <circle cx="72" cy="72" r="64" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <motion.circle
            cx="72" cy="72" r="64"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-foreground font-bold text-3xl tabular-nums tracking-tight">{formatTime(remaining)}</span>
          <span className="text-foreground/40 text-[11px] font-bold uppercase tracking-widest mt-1">{NOISE_LABELS[content.noiseType]}</span>
        </div>
      </div>

      {/* Waveform */}
      <WaveformBars active={playing && !paused} />

      {/* Controls */}
      <div className="flex items-center gap-6 mt-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleMute}
          className="w-12 h-12 rounded-2xl bg-card hover:bg-muted border border-border flex items-center justify-center transition-all shadow-sm"
        >
          {muted ? <VolumeX className="w-5 h-5 text-foreground/40" /> : <Volume2 className="w-5 h-5 text-foreground/60" />}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={playing && !paused ? handlePause : handlePlay}
          className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-all duration-200 shadow-xl shadow-primary/30"
        >
          <AnimatePresence mode="wait">
            {playing && !paused ? (
              <motion.div key="pause" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
                <Pause className="w-8 h-8 text-primary-foreground fill-current" />
              </motion.div>
            ) : (
              <motion.div key="play" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
                <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="w-12 flex items-center justify-center">
          <span className="text-foreground/40 text-sm font-bold tabular-nums">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      {/* Volume slider */}
      <div className="w-full max-w-sm space-y-2 mt-4">
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-foreground/40 px-1">
          <span>Quieter</span>
          <span>Louder</span>
        </div>
        <div className="relative h-3 bg-muted rounded-full overflow-hidden shadow-inner">
          <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${volume * 100}%` }} />
        </div>
        <input
          type="range" min={0} max={1} step={0.01}
          value={volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ position: "relative", top: "-12px", height: "24px" }}
        />
      </div>

      {/* Noise description */}
      <div className="bg-muted/50 rounded-2xl p-4 mt-2 max-w-sm w-full border border-border/50">
        <p className="text-foreground/60 text-[13px] text-center font-medium leading-relaxed">
          {NOISE_DESCRIPTIONS[content.noiseType]}
        </p>
      </div>

      {/* Skip button */}
      <button
        onClick={onComplete}
        className="text-foreground/30 hover:text-foreground/60 text-xs font-bold uppercase tracking-widest transition-colors mt-4 pb-4"
      >
        Skip exercise
      </button>
    </div>
  )
}

