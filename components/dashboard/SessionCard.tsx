"use client"

import { motion } from "framer-motion"
import { PlayCircle, Clock, Volume2, Sparkles, ArrowRight } from "lucide-react"
import type { SessionPlan } from "@/types/dashboard"
import Link from "next/link"

interface Props {
  plan: SessionPlan
  loading?: boolean
}

function Skeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-6 bg-muted rounded-xl w-3/4" />
      <div className="h-4 bg-muted rounded-md w-full" />
      <div className="h-4 bg-muted rounded-md w-5/6" />
      <div className="flex gap-3 mt-5">
        {[1,2,3].map(i => <div key={i} className="h-14 bg-muted rounded-2xl flex-1" />)}
      </div>
      <div className="h-12 bg-muted rounded-2xl mt-4" />
    </div>
  )
}

export function SessionCard({ plan, loading }: Props) {
  if (loading) return <Skeleton />

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Module badge */}
      <div className="flex items-center gap-2">
        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-primary/15 text-primary border border-primary/20">
          Week {plan.therapyWeek} · {plan.module}
        </span>
      </div>

      <p className="text-foreground/70 text-[15px] font-medium leading-relaxed">{plan.moduleDescription}</p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-muted/50 border border-border rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 shadow-sm">
          <Clock className="w-5 h-5 text-primary" />
          <div className="text-center">
            <span className="text-foreground font-bold text-lg tabular-nums leading-none block">{plan.duration}</span>
            <span className="text-foreground/50 text-[10px] font-semibold uppercase tracking-wider mt-1 block">min total</span>
          </div>
        </div>
        <div className="bg-muted/50 border border-border rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 shadow-sm">
          <Volume2 className="w-5 h-5 text-indigo-500" />
          <div className="text-center">
            <span className="text-foreground font-bold text-lg tabular-nums leading-none block">{plan.soundDuration}</span>
            <span className="text-foreground/50 text-[10px] font-semibold uppercase tracking-wider mt-1 block">min sound</span>
          </div>
        </div>
        <div className="bg-muted/50 border border-border rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 shadow-sm">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <div className="text-center">
            <span className="text-foreground font-bold text-xs leading-tight block h-[22px] flex items-center justify-center">{plan.tone.split(" ").slice(0, 2).join(" ")}</span>
            <span className="text-foreground/50 text-[10px] font-semibold uppercase tracking-wider mt-1 block">tone</span>
          </div>
        </div>
      </div>

      {/* Approach note */}
      <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/50 rounded-2xl p-5 shadow-sm">
        <p className="text-foreground/70 text-sm italic leading-relaxed font-serif text-center">&quot;{plan.approach}&quot;</p>
      </div>

      {/* Affirmation */}
      <div className="border-l-4 border-primary/40 pl-4 py-1">
        <p className="text-foreground text-[15px] font-semibold leading-relaxed">{plan.affirmation}</p>
      </div>

      {/* CTA */}
      <motion.div whileTap={{ scale: 0.98 }}>
        <Link
          href="/session"
          className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-3 transition-all duration-200 group shadow-lg shadow-primary/20"
        >
          <PlayCircle className="w-5 h-5" />
          Start today&apos;s session
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </motion.div>
  )
}

