"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Lightbulb } from "lucide-react"
import { loadWeeklyInsight, saveWeeklyInsight, currentWeekKey, loadRecentCheckins, getTherapyWeek } from "@/lib/dashboard-storage"
import { loadOnboardingProfile } from "@/lib/onboarding-storage"

export function WeeklyInsightCard() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cached = loadWeeklyInsight()
    if (cached) {
      setText(cached.text)
      setLoaded(true)
      return
    }
    // Auto-fetch on mount if no cached insight
    fetchInsight()
  }, [])

  async function fetchInsight() {
    setLoading(true)
    try {
      const recentCheckins = loadRecentCheckins(7)
      const profile = loadOnboardingProfile()
      const therapyWeek = getTherapyWeek()

      const res = await fetch("/api/dashboard/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recentCheckins: recentCheckins.map((c) => ({
            loudness: c.loudness,
            distress: c.distress,
            sleepQuality: c.sleepQuality,
            stress: c.stress,
            triggers: c.triggers,
          })),
          profile: profile ? {
            duration: profile.duration,
            sounds: profile.sounds,
            impacts: profile.impacts,
          } : null,
          therapyWeek,
        }),
      })

      const insight = await res.text()
      setText(insight)
      saveWeeklyInsight({
        weekKey: currentWeekKey(),
        text: insight,
        generatedAt: new Date().toISOString(),
      })
      setLoaded(true)
    } catch {
      setText("Keep logging your daily check-ins — your weekly insight will appear here after a few days of data.")
      setLoaded(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary flex-shrink-0" />
        <p className="text-foreground/50 text-sm font-medium">Generating your weekly insight…</p>
      </div>
    )
  }

  if (!loaded) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-start gap-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-5 rounded-2xl">
        <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/50 border border-amber-200/50 dark:border-amber-700/50 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-amber-500" />
        </div>
        <div ref={containerRef}>
          <p className="text-foreground/80 text-[15px] leading-relaxed font-medium">{text}</p>
        </div>
      </div>
    </motion.div>
  )
}

