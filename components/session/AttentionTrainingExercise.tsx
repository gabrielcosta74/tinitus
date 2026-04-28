"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { AttentionContent } from "@/types/session"
import { Ear, ChevronRight } from "lucide-react"

interface Props {
  content: AttentionContent
  onComplete: () => void
}

export function AttentionTrainingExercise({ content, onComplete }: Props) {
  const [anchorIdx, setAnchorIdx] = useState(-1) // -1 = not started
  const started = anchorIdx >= 0
  const current = content.anchors[anchorIdx]
  const isLast = anchorIdx === content.anchors.length - 1

  return (
    <div className="flex flex-col h-full max-w-sm mx-auto w-full pt-4">
      <div className="flex-1 flex flex-col justify-center gap-6">
        {/* Instruction */}
        {!started ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-sm">
              <Ear className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="font-serif text-3xl font-bold text-foreground">Attention Training</h3>
            <p className="text-foreground/70 text-[15px] font-medium leading-relaxed max-w-xs mx-auto">{content.instruction}</p>
            <div className="flex justify-center gap-2">
              {content.anchors.map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-muted shadow-inner" />
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Anchor display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={anchorIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.35 }}
                className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-8 text-center space-y-4 shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center mx-auto">
                  <Ear className="w-6 h-6 text-indigo-500" />
                </div>
                <p className="text-foreground font-bold text-xl leading-snug">{current}</p>
                <p className="text-foreground/40 font-bold uppercase tracking-widest text-[11px]">Anchor {anchorIdx + 1} of {content.anchors.length}</p>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex justify-center gap-2">
              {content.anchors.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm ${
                    i < anchorIdx ? "bg-indigo-500" : i === anchorIdx ? "bg-indigo-500 scale-125" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          if (!started) {
            setAnchorIdx(0)
          } else if (isLast) {
            onComplete()
          } else {
            setAnchorIdx((i) => i + 1)
          }
        }}
        className="mt-8 mb-4 w-full h-14 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-500/20"
      >
        {!started ? "Begin" : isLast ? "Complete exercise" : <>Next anchor <ChevronRight className="w-5 h-5" /></>}
      </motion.button>
    </div>
  )
}

