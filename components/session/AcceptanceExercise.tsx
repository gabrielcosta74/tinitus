"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { AcceptanceContent } from "@/types/session"
import { Leaf, ChevronRight } from "lucide-react"

interface Props {
  content: AcceptanceContent
  onComplete: () => void
}

export function AcceptanceExercise({ content, onComplete }: Props) {
  const [step, setStep] = useState<"metaphor" | "practice">("metaphor")

  return (
    <div className="flex flex-col h-full max-w-sm mx-auto w-full pt-4">
      <div className="flex-1 flex flex-col justify-center gap-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-sm">
            <Leaf className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="font-serif text-3xl font-bold text-foreground">
            {step === "metaphor" ? "A metaphor to hold" : "Your practice"}
          </h3>
          <div className="bg-card border border-border shadow-sm rounded-3xl p-6 text-left">
            <p className="text-foreground/80 text-[17px] leading-relaxed font-medium">
              {step === "metaphor" ? content.metaphor : content.practice}
            </p>
          </div>
        </motion.div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => step === "metaphor" ? setStep("practice") : onComplete()}
        className="mt-8 mb-4 w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-500/20"
      >
        {step === "metaphor" ? <>Begin practice <ChevronRight className="w-5 h-5" /></> : "Complete exercise"}
      </motion.button>
    </div>
  )
}

