"use client"

import { motion } from "framer-motion"

const CHIPS = [
  "I'm having a bad spike right now",
  "Help me sleep tonight",
  "Why does silence make it worse?",
  "I feel like I'll never get better",
  "Review my progress this week",
]

interface PromptChipsProps {
  onSelect: (prompt: string) => void
}

export function PromptChips({ onSelect }: PromptChipsProps) {
  return (
    <div className="px-4 pb-2">
      <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-2.5">
        Suggested — tap to send
      </p>
      <div className="flex flex-wrap gap-2">
        {CHIPS.map((chip, i) => (
          <motion.button
            key={chip}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onSelect(chip)}
            className="px-3 py-1.5 rounded-full border border-white/12 bg-white/5 text-sm text-white/60 hover:border-teal-500/40 hover:bg-teal-500/8 hover:text-white/85 transition-all duration-200"
          >
            {chip}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
