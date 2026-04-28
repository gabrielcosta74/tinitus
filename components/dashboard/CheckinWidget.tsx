"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, ChevronRight, Loader2 } from "lucide-react"
import { saveTodayCheckin, todayKey } from "@/lib/dashboard-storage"
import type { CheckinData } from "@/types/dashboard"

const TRIGGERS = [
  "Caffeine", "Alcohol", "Stress", "Poor sleep", "Loud environment",
  "Fatigue", "Medication", "Exercise", "Silence", "Screen time",
]

interface SliderRowProps {
  label: string
  value: number
  onChange: (v: number) => void
  lowLabel: string
  highLabel: string
  accentColor?: string
}

function SliderRow({ label, value, onChange, lowLabel, highLabel, accentColor = "hsl(var(--primary))" }: SliderRowProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground/80">{label}</span>
        <span className="text-base font-bold tabular-nums" style={{ color: accentColor }}>{value}</span>
      </div>
      <div className="relative h-4 bg-muted rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: accentColor }}
          initial={{ width: 0 }}
          animate={{ width: `${(value / 10) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        />
      </div>
      <input
        type="range"
        min={1} max={10} step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        style={{ position: "relative", top: "-1rem", height: "2rem" }}
      />
      <div className="flex justify-between text-[11px] font-medium text-foreground/40 px-1">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  )
}

interface Props {
  onComplete: (data: CheckinData) => void
}

export function CheckinWidget({ onComplete }: Props) {
  const [loudness, setLoudness] = useState(5)
  const [distress, setDistress] = useState(4)
  const [sleepQuality, setSleepQuality] = useState(6)
  const [stress, setStress] = useState(4)
  const [triggers, setTriggers] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  function toggleTrigger(t: string) {
    setTriggers((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])
  }

  async function handleSubmit() {
    setSaving(true)
    const data: CheckinData = {
      date: todayKey(),
      loudness,
      distress,
      sleepQuality,
      stress,
      triggers,
      completedAt: new Date().toISOString(),
    }
    saveTodayCheckin(data)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    setDone(true)
    setTimeout(() => onComplete(data), 800)
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-10"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-foreground font-bold text-xl mb-1">Check-in complete</p>
          <p className="text-foreground/50 text-sm">Generating your session plan…</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <SliderRow label="Tinnitus loudness" value={loudness} onChange={setLoudness} lowLabel="Barely there" highLabel="Very loud" />
        <SliderRow label="Emotional distress" value={distress} onChange={setDistress} lowLabel="Calm" highLabel="Overwhelming" accentColor="#f59e0b" />
        <SliderRow label="Sleep quality" value={sleepQuality} onChange={setSleepQuality} lowLabel="Terrible" highLabel="Excellent" accentColor="#818cf8" />
        <SliderRow label="Current stress" value={stress} onChange={setStress} lowLabel="Relaxed" highLabel="Very stressed" accentColor="#f87171" />
      </div>

      <div className="pt-2 border-t border-border">
        <p className="text-sm font-semibold text-foreground/80 mb-3">Triggers today (optional)</p>
        <div className="flex flex-wrap gap-2">
          {TRIGGERS.map((t) => {
            const active = triggers.includes(t)
            return (
              <motion.button
                whileTap={{ scale: 0.95 }}
                key={t}
                onClick={() => toggleTrigger(t)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors duration-200 ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-muted border-transparent text-foreground/60 hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {t}
              </motion.button>
            )
          })}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={saving}
        className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 shadow-lg shadow-primary/20"
      >
        {saving ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>Save check-in <ChevronRight className="w-5 h-5" /></>
        )}
      </motion.button>
    </div>
  )
}

