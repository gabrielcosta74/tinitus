"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Ear, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Mode = "login" | "register" | "forgot"

function AuthForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const from = searchParams.get("from")
  const next = searchParams.get("next") ?? "/dashboard"
  const errorParam = searchParams.get("error")
  const emailParam = searchParams.get("email") ?? ""

  const [mode, setMode] = useState<Mode>("login")
  const [email, setEmail] = useState(emailParam)
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(errorParam ?? "")
  const [success, setSuccess] = useState("")

  // If coming from onboarding, default to register
  useEffect(() => {
    if (from === "onboarding") setMode("register")
  }, [from])

  async function syncOnboardingProfile() {
    try {
      const raw = sessionStorage.getItem("tinni_onboarding")
      if (!raw) return
      const state = JSON.parse(raw)
      await fetch("/api/auth/sync-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: state.profile,
          thiScore: state.thiScore,
          thiAnswers: state.thiAnswers,
          frequencyHz: state.frequencyHz,
        }),
      })
    } catch {
      // non-critical
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        })
        if (error) throw error
        setSuccess("Check your email for a password reset link.")
        setLoading(false)
        return
      }

      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}`,
          },
        })
        if (error) throw error
        // Try to sync immediately (session may be active if email confirm disabled)
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          await syncOnboardingProfile()
          router.push(next)
        } else {
          setSuccess("Account created! Check your email to confirm, then sign in.")
          setMode("login")
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        await syncOnboardingProfile()
        router.push(next)
        router.refresh()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const title = mode === "login" ? "Welcome back" : mode === "register" ? "Create your account" : "Reset password"
  const sub =
    mode === "login"
      ? "Sign in to continue your tinnitus therapy"
      : mode === "register"
      ? "Start your personalised tinnitus programme"
      : "We'll send you a link to reset your password"

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-10"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Ear className="w-5 h-5 text-primary" />
        </div>
        <span className="font-serif text-2xl font-bold text-primary tracking-tight">Tinni.</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <h1 className="font-serif text-2xl font-bold text-foreground mb-1">{title}</h1>
          <p className="text-sm text-foreground/50 mb-6">{sub}</p>

          {/* Alerts */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="err"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-500 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                key="ok"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted/50 border border-border text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            {mode !== "forgot" && (
              <div>
                <label className="block text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "register" ? "At least 8 characters" : "Your password"}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-muted/50 border border-border text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Forgot link */}
            {mode === "login" && (
              <div className="text-right -mt-1">
                <button
                  type="button"
                  onClick={() => { setMode("forgot"); setError(""); setSuccess("") }}
                  className="text-xs text-foreground/40 hover:text-primary transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-primary/20 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Switch mode */}
        <div className="text-center mt-5 text-sm text-foreground/40">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => { setMode("register"); setError(""); setSuccess("") }}
                className="text-primary font-semibold hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => { setMode("login"); setError(""); setSuccess("") }}
                className="text-primary font-semibold hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  )
}
