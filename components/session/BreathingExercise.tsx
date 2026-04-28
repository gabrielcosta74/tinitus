"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { BreathingContent } from "@/types/session"

interface Props {
  content: BreathingContent
  onComplete: () => void
}

type Phase = "inhale" | "hold-in" | "exhale" | "hold-out" | "done"

function getPhaseLabel(phase: Phase): string {
  switch (phase) {
    case "inhale": return "Breathe In"
    case "hold-in": return "Hold"
    case "exhale": return "Breathe Out"
    case "hold-out": return "Hold"
    case "done": return "Complete"
  }
}

function getPhaseColor(phase: Phase): string {
  switch (phase) {
    case "inhale": return "#0d9488" // Teal 600
    case "hold-in": return "#6366f1" // Indigo 500
    case "exhale": return "#f59e0b" // Amber 500
    case "hold-out": return "#8b5cf6" // Violet 500
    case "done": return "#10b981" // Emerald 500
  }
}

export function BreathingExercise({ content, onComplete }: Props) {
  const { pattern, cycles } = content
  const [currentCycle, setCurrentCycle] = useState(1)
  const [phase, setPhase] = useState<Phase>("inhale")
  const [countdown, setCountdown] = useState(pattern.inhale)
  const [started, setStarted] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  function buildSequence(): { phase: Phase; duration: number }[] {
    const seq: { phase: Phase; duration: number }[] = [
      { phase: "inhale", duration: pattern.inhale },
    ]
    if (pattern.hold > 0) seq.push({ phase: "hold-in", duration: pattern.hold })
    seq.push({ phase: "exhale", duration: pattern.exhale })
    if (pattern.holdOut && pattern.holdOut > 0) seq.push({ phase: "hold-out", duration: pattern.holdOut })
    return seq
  }

  useEffect(() => {
    if (!started) return
    const sequence = buildSequence()
    let seqIdx = 0
    let cycleCount = 1
    let tick = sequence[0].duration

    setPhase(sequence[0].phase)
    setCountdown(sequence[0].duration)

    timerRef.current = setInterval(() => {
      tick--
      if (tick <= 0) {
        seqIdx++
        if (seqIdx >= sequence.length) {
          seqIdx = 0
          cycleCount++
          setCurrentCycle(cycleCount)
          if (cycleCount > cycles) {
            clearInterval(timerRef.current!)
            setPhase("done")
            setTimeout(onComplete, 1200)
            return
          }
        }
        tick = sequence[seqIdx].duration
        setPhase(sequence[seqIdx].phase)
      }
      setCountdown(tick)
    }, 1000)

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [started]) // eslint-disable-line

  const phaseColor = getPhaseColor(phase)
  const phaseLabel = getPhaseLabel(phase)

  const circleScale = phase === "inhale" ? 1 : phase === "exhale" ? 0.55 : phase === "hold-in" ? 1 : phase === "hold-out" ? 0.55 : 1
  const phaseDuration = phase === "inhale" ? pattern.inhale : phase === "exhale" ? pattern.exhale : phase === "hold-in" ? pattern.hold : pattern.holdOut ?? 0

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <div className="text-center space-y-4 max-w-sm">
          <h3 className="font-serif text-3xl font-bold text-foreground">{content.instruction.split(".")[0]}.</h3>
          <p className="text-foreground/60 text-[15px] leading-relaxed">{content.instruction}</p>
        </div>

        <div className="flex gap-4 text-center justify-center">
          {[
            { label: "Inhale", val: pattern.inhale + "s" },
            ...(pattern.hold > 0 ? [{ label: "Hold", val: pattern.hold + "s" }] : []),
            { label: "Exhale", val: pattern.exhale + "s" },
            ...(pattern.holdOut ? [{ label: "Hold", val: pattern.holdOut + "s" }] : []),
          ].map((item, i) => (
            <div key={i} className="bg-muted border border-border rounded-2xl px-5 py-4 w-[72px] shadow-sm">
              <div className="text-foreground font-bold text-xl">{item.val}</div>
              <div className="text-foreground/50 text-[10px] uppercase tracking-wider font-semibold mt-1">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="text-foreground/50 text-sm font-medium bg-muted px-4 py-1.5 rounded-full">
          {cycles} cycles · ~{Math.ceil((pattern.inhale + pattern.hold + pattern.exhale + (pattern.holdOut ?? 0)) * cycles / 60)} min
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setStarted(true)}
          className="w-full max-w-[240px] h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all duration-200 shadow-lg shadow-primary/20"
        >
          Begin breathing
        </motion.button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-10">
      {/* Breathing circle */}
      <div className="relative flex items-center justify-center">
        {/* Outer glow ring */}
        <motion.div
          animate={{ scale: circleScale * 1.45, opacity: 0.08 }}
          transition={{ duration: phaseDuration, ease: phase === "inhale" ? "easeIn" : "easeOut" }}
          className="absolute w-64 h-64 rounded-full"
          style={{ backgroundColor: phaseColor }}
        />
        {/* Middle ring */}
        <motion.div
          animate={{ scale: circleScale * 1.2, opacity: 0.15 }}
          transition={{ duration: phaseDuration, ease: phase === "inhale" ? "easeIn" : "easeOut" }}
          className="absolute w-56 h-56 rounded-full"
          style={{ backgroundColor: phaseColor }}
        />
        {/* Core circle */}
        <motion.div
          animate={{ scale: circleScale }}
          transition={{ duration: phaseDuration, ease: phase === "inhale" ? "easeIn" : "easeOut" }}
          className="w-48 h-48 rounded-full flex flex-col items-center justify-center border-[3px] shadow-lg shadow-black/5"
          style={{ backgroundColor: "#ffffff", borderColor: phaseColor }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-5xl font-bold tabular-nums"
              style={{ color: phaseColor }}
            >
              {phase === "done" ? "✓" : countdown}
            </motion.span>
          </AnimatePresence>
          <motion.span
            key={phase + "-label"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs uppercase tracking-widest font-bold mt-2"
            style={{ color: phaseColor, opacity: 0.7 }}
          >
            {phaseLabel}
          </motion.span>
        </motion.div>
      </div>

      {/* Cycle counter */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          {Array.from({ length: cycles }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i < currentCycle - 1 ? "bg-primary" : i === currentCycle - 1 ? "bg-primary scale-125" : "bg-muted-foreground/20"
              }`}
            />
          ))}
        </div>
        <span className="text-foreground/40 text-[11px] font-semibold uppercase tracking-widest">
          Cycle {Math.min(currentCycle, cycles)} of {cycles}
        </span>
      </div>
    </div>
  )
}

