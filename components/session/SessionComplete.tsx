"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Flame, ArrowRight, Home } from "lucide-react"
import Link from "next/link"

interface Props {
  module: string
  durationMinutes: number
  exerciseCount: number
  streak: number
}

export function SessionComplete({ module, durationMinutes, exerciseCount, streak }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12 gap-10 text-center max-w-lg mx-auto">
      {/* Check animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="relative"
      >
        <div className="w-28 h-28 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5">
          <CheckCircle2 className="w-14 h-14 text-primary" />
        </div>
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-[2px] border-primary/30"
          animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="font-serif text-4xl font-bold text-foreground">Session complete</h2>
        <p className="text-foreground/60 text-[17px] leading-relaxed max-w-sm mx-auto font-medium">
          You showed up and did the work. That is exactly how habituation is built.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="flex gap-4 w-full"
      >
        <div className="bg-muted border border-border rounded-3xl px-4 py-5 text-center flex-1 shadow-sm">
          <div className="text-foreground font-bold text-3xl tabular-nums leading-none mb-1.5">{durationMinutes}</div>
          <div className="text-foreground/50 text-[11px] font-bold uppercase tracking-wider">minutes</div>
        </div>
        <div className="bg-muted border border-border rounded-3xl px-4 py-5 text-center flex-1 shadow-sm">
          <div className="text-foreground font-bold text-3xl tabular-nums leading-none mb-1.5">{exerciseCount}</div>
          <div className="text-foreground/50 text-[11px] font-bold uppercase tracking-wider">exercises</div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/50 rounded-3xl px-4 py-5 text-center flex-1 shadow-sm">
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <Flame className="w-5 h-5 text-amber-500" />
            <span className="text-foreground font-bold text-3xl tabular-nums leading-none">{streak}</span>
          </div>
          <div className="text-amber-600/60 dark:text-amber-500/60 text-[11px] font-bold uppercase tracking-wider">day streak</div>
        </div>
      </motion.div>

      {/* Module badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="px-4 py-2 rounded-full text-[13px] font-bold bg-primary/10 text-primary border border-primary/20 shadow-sm">
          ✓ {module}
        </span>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col gap-4 w-full mt-4"
      >
        <Link href="/dashboard" className="outline-none block">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[15px] flex items-center justify-center gap-3 transition-colors shadow-lg shadow-primary/20"
          >
            <Home className="w-5 h-5" /> Back to dashboard
          </motion.button>
        </Link>
        <Link href="/sounds" className="outline-none block">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full h-14 rounded-2xl bg-muted hover:bg-muted/80 border border-border text-foreground/80 font-bold text-[15px] flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            Continue with sound therapy <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}

