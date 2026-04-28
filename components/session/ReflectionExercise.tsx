"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { ReflectionContent } from "@/types/session"
import { MessageSquare, ChevronRight } from "lucide-react"

interface Props {
  content: ReflectionContent
  onComplete: () => void
}

export function ReflectionExercise({ content, onComplete }: Props) {
  const [answer, setAnswer] = useState("")
  const [followUp, setFollowUp] = useState("")
  const [step, setStep] = useState<"prompt" | "followup" | "done">("prompt")

  return (
    <div className="flex flex-col h-full max-w-sm mx-auto w-full pt-4">
      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 shadow-sm">
            <MessageSquare className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <h3 className="text-foreground font-bold text-xl">Session Reflection</h3>
            <p className="text-foreground/50 text-[13px] font-medium mt-0.5">There are no right answers — only honest ones</p>
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <p className="text-foreground/80 text-[17px] leading-relaxed font-bold mb-4">
              {step === "prompt" ? content.prompt : content.followUp}
            </p>
            <textarea
              value={step === "prompt" ? answer : followUp}
              onChange={(e) => step === "prompt" ? setAnswer(e.target.value) : setFollowUp(e.target.value)}
              placeholder="Write freely — this is just for you…"
              rows={5}
              className="w-full bg-background border border-border rounded-2xl p-4 text-foreground text-[15px] placeholder:text-foreground/30 resize-none focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-150 shadow-sm font-medium"
            />
          </div>
        </motion.div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          if (step === "prompt") setStep("followup")
          else onComplete()
        }}
        className="mt-6 w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-amber-500/20"
      >
        {step === "prompt" ? <>One more question <ChevronRight className="w-5 h-5" /></> : "Complete session"}
      </motion.button>

      <p className="text-foreground/30 text-[11px] font-bold uppercase tracking-widest text-center mt-4 mb-4">Your reflections stay on this device only</p>
    </div>
  )
}

