"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckinWidget } from "@/components/dashboard/CheckinWidget"
import { SessionCard } from "@/components/dashboard/SessionCard"
import { THITrendChart } from "@/components/dashboard/THITrendChart"
import { WeeklyInsightCard } from "@/components/dashboard/WeeklyInsightCard"
import { QuickAccessTiles } from "@/components/dashboard/QuickAccessTiles"
import { StreakBadge } from "@/components/dashboard/StreakBadge"
import {
  loadTodayCheckin,
  loadSessionPlan,
  saveSessionPlan,
  loadRecentCheckins,
  calculateStreak,
  getTherapyWeek,
} from "@/lib/dashboard-storage"
import type { CheckinData, SessionPlan } from "@/types/dashboard"
import { Ear, RefreshCw } from "lucide-react"

function DashboardCard({
  title,
  children,
  className = "",
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`bg-card border border-border shadow-sm rounded-3xl p-6 ${className}`}>
      {title && (
        <h2 className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-5">{title}</h2>
      )}
      {children}
    </div>
  )
}

export default function DashboardPage() {
  const [todayCheckin, setTodayCheckin] = useState<CheckinData | null>(null)
  const [sessionPlan, setSessionPlan] = useState<SessionPlan | null>(null)
  const [sessionLoading, setSessionLoading] = useState(false)
  const [recentCheckins, setRecentCheckins] = useState<CheckinData[]>([])
  const [streak, setStreak] = useState(0)
  const [therapyWeek, setTherapyWeek] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkin = loadTodayCheckin()
    const plan = loadSessionPlan()
    const recent = loadRecentCheckins(7)
    const s = calculateStreak()
    const tw = getTherapyWeek()

    setTodayCheckin(checkin)
    setSessionPlan(plan)
    setRecentCheckins(recent)
    setStreak(s)
    setTherapyWeek(tw)

    if (checkin && !plan) {
      fetchSessionPlan(checkin, tw)
    }
  }, [])

  const fetchSessionPlan = useCallback(async (checkin: CheckinData, tw: number) => {
    setSessionLoading(true)
    try {
      const res = await fetch("/api/dashboard/session-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkin: {
            loudness: checkin.loudness,
            distress: checkin.distress,
            sleepQuality: checkin.sleepQuality,
            stress: checkin.stress,
            triggers: checkin.triggers,
          },
          therapyWeek: tw,
        }),
      })
      const plan = (await res.json()) as SessionPlan
      saveSessionPlan(plan)
      setSessionPlan(plan)
    } catch {
      // leave as null
    } finally {
      setSessionLoading(false)
    }
  }, [])

  function handleCheckinComplete(data: CheckinData) {
    setTodayCheckin(data)
    const recent = loadRecentCheckins(7)
    setRecentCheckins(recent)
    const s = calculateStreak()
    setStreak(s)
    fetchSessionPlan(data, therapyWeek)
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  if (!mounted) return null

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-2xl border-b border-border px-5 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-foreground/50 text-xs font-semibold uppercase tracking-wider">{greeting}</p>
            <h1 className="text-foreground font-serif text-2xl font-bold mt-1 leading-tight">Your Dashboard</h1>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Ear className="w-5 h-5 text-primary" />
          </div>
        </div>
      </header>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-3xl mx-auto px-4 py-8 space-y-6"
      >
        <motion.div variants={itemVariants}>
          <StreakBadge streak={streak} therapyWeek={therapyWeek} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <QuickAccessTiles />
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatePresence mode="wait">
            {!todayCheckin ? (
              <DashboardCard key="checkin" title="Daily Check-in">
                <p className="text-foreground/60 text-sm mb-6 leading-relaxed">
                  How is your tinnitus today? Your answers adapt your session plan in real time.
                </p>
                <CheckinWidget onComplete={handleCheckinComplete} />
              </DashboardCard>
            ) : (
              <DashboardCard key="session" title="Today's Session Plan">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                    <span className="text-xs font-medium text-foreground/50">AI-adapted to your check-in</span>
                  </div>
                  <button
                    onClick={() => fetchSessionPlan(todayCheckin, therapyWeek)}
                    disabled={sessionLoading}
                    className="p-2 rounded-xl hover:bg-muted transition-colors active:scale-95"
                    title="Regenerate plan"
                  >
                    <RefreshCw className={`w-4 h-4 text-foreground/40 ${sessionLoading ? "animate-spin" : ""}`} />
                  </button>
                </div>
                <SessionCard plan={sessionPlan!} loading={sessionLoading || !sessionPlan} />
              </DashboardCard>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants}>
          <DashboardCard title="7-Day Trend">
            <THITrendChart checkins={recentCheckins} />
          </DashboardCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <DashboardCard title="Weekly Insight">
            <WeeklyInsightCard />
          </DashboardCard>
        </motion.div>

        <div className="h-6" />
      </motion.div>
    </div>
  )
}

