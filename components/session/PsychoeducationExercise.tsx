"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { PsychoeducationContent } from "@/types/session"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
  content: PsychoeducationContent
  onComplete: () => void
}

export function PsychoeducationExercise({ content, onComplete }: Props) {
  const [slide, setSlide] = useState(0)
  const total = content.slides.length
  const current = content.slides[slide]
  const isLast = slide === total - 1

  return (
    <div className="flex flex-col h-full">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8 mt-4">
        {content.slides.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === slide ? "w-8 bg-primary" : i < slide ? "w-4 bg-primary/40" : "w-4 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="font-serif text-3xl font-bold text-foreground leading-snug">
              {current.heading}
            </h3>
            <p className="text-foreground/70 text-[17px] leading-relaxed font-medium">{current.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 mt-8 pb-4 max-w-sm mx-auto w-full">
        {slide > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSlide((s) => s - 1)}
            className="flex-none w-14 h-14 rounded-2xl bg-card border border-border hover:bg-muted flex items-center justify-center transition-all duration-150 shadow-sm"
          >
            <ChevronLeft className="w-6 h-6 text-foreground/60" />
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => isLast ? onComplete() : setSlide((s) => s + 1)}
          className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-primary/20"
        >
          {isLast ? "Continue to next exercise" : (
            <>Next <ChevronRight className="w-5 h-5" /></>
          )}
        </motion.button>
      </div>
    </div>
  )
}

