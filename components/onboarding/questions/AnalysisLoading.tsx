"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Sparkles, Activity } from "lucide-react"

const MESSAGES = [
  { text: "Analyzing your THI responses...", icon: Brain },
  { text: "Calculating severity tier...", icon: Activity },
  { text: "Tailoring CBT curriculum...", icon: Sparkles },
  { text: "Calibrating sound therapy frequencies...", icon: Activity },
  { text: "Finalizing your personalized plan...", icon: Brain },
]

export function AnalysisLoading({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const totalDuration = 4500 // 4.5 seconds total loading time
    const intervalTime = totalDuration / MESSAGES.length
    
    let currentIdx = 0
    const interval = setInterval(() => {
      currentIdx++
      if (currentIdx < MESSAGES.length) {
        setIndex(currentIdx)
      } else {
        clearInterval(interval)
        setTimeout(onComplete, 500)
      }
    }, intervalTime)

    return () => clearInterval(interval)
  }, [onComplete])

  const CurrentIcon = MESSAGES[index].icon

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-10">
      <div className="relative flex items-center justify-center w-32 h-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-[3px] border-primary/20 border-t-primary"
        />
        <motion.div
          animate={{ scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
        >
          <CurrentIcon className="w-8 h-8 text-primary" />
        </motion.div>
      </div>

      <div className="h-10 relative w-full max-w-sm flex justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-lg font-bold text-foreground absolute text-center w-full"
          >
            {MESSAGES[index].text}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
