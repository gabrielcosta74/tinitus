"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { CognitiveContent } from "@/types/session"
import { AlertTriangle, HelpCircle, Sparkles, ChevronRight } from "lucide-react"

interface Props {
  content: CognitiveContent
  onComplete: () => void
}

type Step = "thought" | "challenge" | "reframe" | "affirmation"
const STEPS: Step[] = ["thought", "challenge", "reframe", "affirmation"]

export function CognitiveRestructuringExercise({ content, onComplete }: Props) {
  const [step, setStep] = useState<Step>("thought")
  const stepIdx = STEPS.indexOf(step)

  const configs = {
    thought: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      label: "The distorted thought",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: content.thought,
      cta: "Now let's examine it",
    },
    challenge: {
      icon: <HelpCircle className="w-5 h-5 text-indigo-500" />,
      label: "Challenging the evidence",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      text: content.challenge,
      cta: "Build a reframe",
    },
    reframe: {
      icon: <Sparkles className="w-5 h-5 text-teal-500" />,
      label: "A more balanced thought",
      bg: "bg-teal-500/10",
      border: "border-teal-500/20",
      text: content.reframe,
      cta: "Anchor this",
    },
    affirmation: {
      icon: <Sparkles className="w-5 h-5 text-emerald-500" />,
      label: "Your affirmation",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: content.affirmation,
      cta: "Complete exercise",
    },
  }

  const cfg = configs[step]

  return (
    <div className="flex flex-col h-full max-w-sm mx-auto w-full pt-4">
      {/* Progress bar */}
      <div className="flex gap-1.5 mb-8">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
              i <= stepIdx ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-center gap-6">
        {/* Step card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-6 space-y-4 shadow-sm ${cfg.bg} ${cfg.border}`}
        >
          <div className="flex items-center gap-2">
            {cfg.icon}
            <span className="text-[11px] font-bold text-foreground/50 uppercase tracking-widest">{cfg.label}</span>
          </div>
          <p className="text-foreground/80 text-[17px] leading-relaxed font-bold">
            {cfg.text}
          </p>
        </motion.div>

        {/* Previous step summary */}
        {stepIdx > 0 && (
          <div className="space-y-3 mt-4">
            {STEPS.slice(0, stepIdx).map((s) => (
              <div key={s} className="flex items-start gap-3 opacity-60">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p className="text-foreground/60 text-sm font-medium leading-relaxed">{configs[s].text.slice(0, 80)}…</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => stepIdx < STEPS.length - 1 ? setStep(STEPS[stepIdx + 1]) : onComplete()}
        className="mt-8 mb-4 w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-primary/20"
      >
        {cfg.cta} <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  )
}

