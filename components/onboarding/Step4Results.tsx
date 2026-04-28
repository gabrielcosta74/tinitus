"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getSeverity } from "@/lib/thi"
import type { TinnitusProfile } from "@/types/onboarding"
import {
  Activity,
  Brain,
  Waves,
  Moon,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileText
} from "lucide-react"

interface Step4ResultsProps {
  thiScore: number
  frequencyHz: number
  profile: TinnitusProfile
}

function formatHz(hz: number): string {
  return hz >= 1000 ? `${(hz / 1000).toFixed(1)} kHz` : `${hz} Hz`
}

const PROGRAMME_MODULES = [
  { icon: Brain, label: "12-week CBT programme", desc: "Clinically proven cognitive restructuring" },
  { icon: Waves, label: "Personalised notch therapy", desc: `Filtered to your ${0} Hz tinnitus` },
  { icon: Activity, label: "Daily AI coaching", desc: "Adapts to how you feel each day" },
  { icon: Moon, label: "Sleep protocol", desc: "Bedtime sound therapy + body scan" },
]

export function Step4Results({ thiScore, frequencyHz, profile }: Step4ResultsProps) {
  const severity = getSeverity(thiScore)
  const [summary, setSummary] = useState("")
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [summaryError, setSummaryError] = useState(false)
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    async function fetchSummary() {
      try {
        const res = await fetch("/api/onboarding/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile, thiScore, severity: severity.label, frequencyHz }),
          signal: AbortSignal.timeout(30_000),
        })
        if (!res.ok) throw new Error("API error")

        const reader = res.body?.getReader()
        if (!reader) throw new Error("No reader")

        const decoder = new TextDecoder()
        let accumulated = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          setSummary(accumulated)
        }
      } catch {
        setSummaryError(true)
      } finally {
        setSummaryLoading(false)
      }
    }

    fetchSummary()
  }, [profile, thiScore, severity.label, frequencyHz])

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 400))
    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => {
      window.location.href = `/auth?from=onboarding&email=${encodeURIComponent(email.trim())}`
    }, 800)
  }

  // Score gauge arc
  const gaugeAngle = (thiScore / 100) * 180 - 90 // -90 to +90

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto pb-24"
    >
      {/* Clinical report header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-[11px] font-bold text-primary tracking-widest uppercase">
              Assessment Complete
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-2">
            Your Clinical Report
          </h2>
          <p className="text-foreground/50 text-sm font-medium">
            {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="text-right text-xs text-foreground/30 font-bold uppercase tracking-widest leading-relaxed hidden sm:block">
          THI Assessment<br />
          Newman et al. 1996
        </div>
      </div>

      {/* Score card */}
      <div className={`rounded-3xl border p-8 mb-6 shadow-sm ${severity.bgColor} ${severity.borderColor}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-bold tracking-widest text-foreground/50 uppercase mb-2">THI Score</p>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-7xl font-bold text-foreground tracking-tight">{thiScore}</span>
              <span className="text-foreground/40 text-xl font-bold">/100</span>
            </div>
          </div>

          {/* SVG Gauge */}
          <div className="relative w-32 h-20 flex-shrink-0 drop-shadow-md">
            <svg viewBox="0 0 120 68" className="w-full h-full">
              {/* Background arc */}
              <path
                d="M 10 60 A 50 50 0 0 1 110 60"
                fill="none"
                stroke="rgba(0,0,0,0.05)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              {/* Score arc */}
              <motion.path
                d="M 10 60 A 50 50 0 0 1 110 60"
                fill="none"
                stroke={severity.ringColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="157"
                initial={{ strokeDashoffset: 157 }}
                animate={{ strokeDashoffset: 157 - (thiScore / 100) * 157 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              />
              {/* Needle */}
              <motion.line
                x1="60"
                y1="60"
                initial={{ x2: 60, y2: 10, rotate: -90 }}
                animate={{
                  rotate: gaugeAngle,
                }}
                style={{ transformOrigin: "60px 60px" }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                stroke="#1f2937"
                strokeWidth="3.5"
                strokeLinecap="round"
                x2="60"
                y2="14"
              />
              <circle cx="60" cy="60" r="5" fill="#1f2937" />
            </svg>
          </div>
        </div>

        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/50 shadow-sm ${severity.borderColor}`}>
          <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: severity.ringColor }} />
          <span className={`font-bold text-[13px] uppercase tracking-wide ${severity.textColor}`}>
            Grade {severity.grade} — {severity.label}
          </span>
        </div>
        <p className="text-foreground/70 text-[15px] mt-4 font-medium leading-relaxed max-w-md">{severity.description}</p>
      </div>

      {/* Frequency + impacts row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <p className="text-[11px] font-bold tracking-widest text-foreground/40 uppercase mb-3">Tinnitus Frequency</p>
          <div className="font-serif text-4xl font-bold text-foreground">{formatHz(frequencyHz)}</div>
          <p className="text-xs text-foreground/50 mt-1.5 font-medium">Used to personalise your notch filter</p>
          <div className="mt-5 h-8 relative overflow-hidden rounded-lg opacity-80">
            {/* Frequency visualisation */}
            <svg viewBox="0 0 200 24" className="w-full h-full" preserveAspectRatio="none">
              <motion.path
                d={`M 0 12 ${Array.from({ length: 40 }, (_, i) => {
                  const x = (i / 39) * 200
                  const notchPos = Math.log(frequencyHz / 500) / Math.log(12000 / 500)
                  const notchX = notchPos * 200
                  const dist = Math.abs(x - notchX)
                  const amplitude = dist < 20 ? 2 + (dist / 20) * 10 : 10
                  const y = 12 + Math.sin(i * 0.8) * amplitude
                  return `L ${x} ${y}`
                }).join(" ")}`}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </svg>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <p className="text-[11px] font-bold tracking-widest text-foreground/40 uppercase mb-3">Primary Impacts</p>
          <div className="flex flex-wrap gap-2">
            {profile.impacts.slice(0, 3).map((impact) => (
              <span
                key={impact}
                className="px-3 py-1.5 rounded-full text-xs font-bold bg-muted text-foreground/80 border border-border shadow-sm"
              >
                {impact}
              </span>
            ))}
            {profile.impacts.length > 3 && (
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-background text-foreground/40 border border-border border-dashed">
                +{profile.impacts.length - 3} more
              </span>
            )}
          </div>
          <div className="mt-5 space-y-1.5">
            <p className="text-xs text-foreground/50 font-medium">
              Duration: <span className="text-foreground/80 font-bold">{profile.duration.replace(/-/g, " ")}</span>
            </p>
            <p className="text-xs text-foreground/50 font-medium">
              Stress level: <span className="text-foreground/80 font-bold">{profile.stressLevel}/5</span>
            </p>
          </div>
        </div>
      </div>

      {/* AI summary */}
      <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 mb-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-primary" />
          <p className="text-[11px] font-bold tracking-widest text-primary uppercase">
            Clinical Insights
          </p>
        </div>
        <AnimatePresence mode="wait">
          {summaryLoading && !summary && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 text-foreground/50"
            >
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-[15px] font-medium">Generating your personalised assessment…</span>
            </motion.div>
          )}
          {summaryError && !summary && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-orange-500">
              <AlertCircle className="w-5 h-5" />
              <span className="text-[15px] font-medium">Assessment generated from profile data.</span>
            </motion.div>
          )}
          {summary && (
            <motion.p
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-foreground/80 leading-relaxed text-[15px] font-medium relative z-10"
            >
              {summary}
              {summaryLoading && <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-1 align-middle rounded-sm" />}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Recommended programme */}
      <div className="rounded-3xl border border-border bg-card p-8 mb-8 shadow-sm">
        <p className="text-[11px] font-bold tracking-widest text-foreground/40 uppercase mb-6">
          Your Recommended Programme
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PROGRAMME_MODULES.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[15px] font-bold text-foreground mb-0.5 leading-tight">
                  {label.replace("0", formatHz(frequencyHz))}
                </div>
                <div className="text-[13px] text-foreground/50 font-medium leading-snug">
                  {desc.replace("0", formatHz(frequencyHz))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create account CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-3xl border border-border bg-muted/30 p-8 shadow-sm text-center"
      >
        <h3 className="font-serif text-3xl font-bold text-foreground mb-2">
          Begin your programme
        </h3>
        <p className="text-foreground/60 text-[15px] font-medium mb-8 max-w-sm mx-auto">
          Save your clinical report and start your tailored treatment plan today.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 text-primary py-4 font-bold"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>Taking you to sign up…</span>
          </motion.div>
        ) : (
          <div className="max-w-sm mx-auto">
            {/* Email form */}
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3 mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-foreground placeholder-foreground/30 text-[15px] font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
              <button
                type="submit"
                disabled={submitting || !email}
                className="w-full h-14 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-bold text-lg rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Continue to Plan <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/30">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Google button */}
            <button
              onClick={() => {
                window.location.href = "/auth?from=onboarding"
              }}
              className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-2xl border border-border bg-card hover:bg-muted text-foreground text-[15px] font-bold transition-all shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-[11px] font-medium text-foreground/40 mt-6">
              By continuing you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

