"use client"

import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-[#080810] flex flex-col">
      <header className="sticky top-0 z-30 bg-[#080810]/90 backdrop-blur-xl border-b border-white/[0.06] px-5 py-4">
        <h1 className="text-white font-serif text-xl font-bold">Progress</h1>
        <p className="text-white/35 text-xs mt-0.5">Your THI journey over time</p>
      </header>
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center mx-auto">
            <TrendingUp className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-white font-serif text-2xl font-bold">Progress Tracking</h2>
          <p className="text-white/45 text-sm leading-relaxed">
            Full THI score history, monthly check-in heatmaps, distress trends, and programme milestone tracking — built for Phase 7.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/30 text-xs">
            Coming in Phase 7
          </div>
        </motion.div>
      </div>
    </div>
  )
}
