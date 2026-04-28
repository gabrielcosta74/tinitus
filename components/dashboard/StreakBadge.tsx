"use client"

import { motion } from "framer-motion"
import { Flame, Calendar } from "lucide-react"

interface Props {
  streak: number
  therapyWeek: number
}

export function StreakBadge({ streak, therapyWeek }: Props) {
  return (
    <div className="flex items-stretch gap-4">
      {/* Streak */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="relative flex-1 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-200/50 dark:border-amber-900/50 rounded-3xl p-5 flex items-center gap-4 shadow-sm"
      >
        <div className="relative w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center border border-amber-200/50 dark:border-amber-700/50">
          <motion.div
            animate={{ scale: [1, 1.1, 1], filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Flame className="w-6 h-6 text-amber-500 dark:text-amber-400" />
          </motion.div>
        </div>
        <div>
          <p className="text-3xl font-bold tabular-nums text-foreground leading-none">
            {streak}
            <span className="text-sm font-semibold text-foreground/40 ml-1.5">day{streak !== 1 ? "s" : ""}</span>
          </p>
          <p className="text-xs font-medium text-foreground/50 mt-1 uppercase tracking-wide">Current streak</p>
        </div>
        {/* Shimmer line */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent skew-x-12"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
        />
      </motion.div>

      {/* Programme week */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
        className="flex-1 bg-gradient-to-br from-teal-50 to-teal-50/50 dark:from-teal-950/40 dark:to-teal-950/20 border border-teal-200/50 dark:border-teal-900/50 rounded-3xl p-5 flex items-center gap-4 shadow-sm"
      >
        <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center border border-teal-200/50 dark:border-teal-700/50">
          <Calendar className="w-6 h-6 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <p className="text-3xl font-bold tabular-nums text-foreground leading-none">
            {therapyWeek}
            <span className="text-sm font-semibold text-foreground/40 ml-1.5">/ 12</span>
          </p>
          <p className="text-xs font-medium text-foreground/50 mt-1 uppercase tracking-wide">Prog. week</p>
        </div>
      </motion.div>
    </div>
  )
}

