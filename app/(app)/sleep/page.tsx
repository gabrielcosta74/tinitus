"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Play, Square, ChevronRight, X, Sun, Star } from "lucide-react"
import { useAudioEngine } from "@/hooks/useAudioEngine"
import { SoundType } from "@/lib/audio-engine"
import { loadOnboardingState } from "@/lib/onboarding-storage"

// ─── Body scan content ────────────────────────────────────────────────────────

const BODY_SCAN_STEPS = [
  {
    title: "Settle in",
    text: "Find a position you can stay in without effort — lying down is ideal. Let your arms rest at your sides, palms facing up. Close your eyes. You don't need to do anything right now except breathe.",
  },
  {
    title: "Follow your breath",
    text: "Take three slow breaths. Breathe in through your nose for a count of four, hold for two, out through your mouth for six. Feel the breath move through your body — not the sound in your ears. Your breath is always here, always yours.",
  },
  {
    title: "Notice without judgment",
    text: "The sound may be present right now. That's okay. We're not trying to make it stop. We're simply going to let your body become more interesting to your brain than the sound is. Gently, without force.",
  },
  {
    title: "Your face and jaw",
    text: "Bring attention to your face. Notice your forehead — let any held tension soften. Your jaw: unclench it gently. Let your tongue rest on the floor of your mouth. Your ears are just part of your body, like everything else — surfaces that register sensation.",
  },
  {
    title: "Neck and shoulders",
    text: "Move your awareness to your neck. It holds a great deal — the strain of constant vigilance. Let it soften now. Allow your shoulders to drop slightly. There is nothing to brace against in this moment.",
  },
  {
    title: "Chest and heart",
    text: "Settle your attention on your chest. Feel it rise and fall. Notice the warmth there. Your heart has been working for you all day, every day, without being asked. Rest here for a moment and acknowledge it.",
  },
  {
    title: "Arms and hands",
    text: "Let your awareness travel down your arms to your hands. Notice any tingling or warmth. Your hands can soften completely — open them slightly if they want to. There is nothing to hold right now.",
  },
  {
    title: "Belly and lower back",
    text: "Bring attention to your belly. Feel it rise with each inhale. Let it be soft — no holding. Move awareness to your lower back and let it sink into the surface beneath you. Gravity is doing the work.",
  },
  {
    title: "Hips, legs, and feet",
    text: "Allow your attention to flow into your hips, thighs, calves, and all the way to your feet. Notice the weight of your legs. Let them become heavy and still. Your feet can release completely.",
  },
  {
    title: "Your whole body",
    text: "Now hold a soft awareness of your whole body at once — a gentle panorama. You are here. You are more than the sound in your ears. You are breath, warmth, weight, and quiet presence.",
  },
  {
    title: "Returning to stillness",
    text: "The sound may still be there. From this place of stillness, notice how different it feels when your body is at ease. Not gone — but smaller. Let yourself drift now. The audio will continue as you sleep. You have done enough.",
  },
]

// ─── Sleep presets ────────────────────────────────────────────────────────────

interface SleepPreset {
  label: string
  emoji: string
  layers: [
    { type: SoundType | null; volume: number },
    { type: SoundType | null; volume: number },
    { type: SoundType | null; volume: number },
  ]
}

const SLEEP_PRESETS: SleepPreset[] = [
  {
    label: "Ocean",
    emoji: "🌊",
    layers: [
      { type: "ocean", volume: 0.6 },
      { type: "pink", volume: 0.25 },
      { type: "binaural-theta", volume: 0.12 },
    ],
  },
  {
    label: "Rain Storm",
    emoji: "🌧",
    layers: [
      { type: "rain", volume: 0.65 },
      { type: "brown", volume: 0.35 },
      { type: "binaural-theta", volume: 0.1 },
    ],
  },
  {
    label: "Deep Theta",
    emoji: "🌌",
    layers: [
      { type: "brown", volume: 0.5 },
      { type: "fractal", volume: 0.25 },
      { type: "binaural-theta", volume: 0.2 },
    ],
  },
]

const FADE_OPTIONS: { label: string; minutes: number | null }[] = [
  { label: "30 min", minutes: 30 },
  { label: "60 min", minutes: 60 },
  { label: "∞", minutes: null },
]

const SLEEP_SESSION_KEY = "tinni_sleep_session"

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SleepPage() {
  const [notchHz, setNotchHz] = useState<number | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [fadeMinutes, setFadeMinutes] = useState<number | null>(60)
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null)
  const [bodyScanOpen, setBodyScanOpen] = useState(false)
  const [bodyScanStep, setBodyScanStep] = useState(0)
  const [dimmed, setDimmed] = useState(false)
  const [clock, setClock] = useState("")
  const [showMorningPrompt, setShowMorningPrompt] = useState(false)
  const [morningRating, setMorningRating] = useState(0)
  const [morningDone, setMorningDone] = useState(false)

  const { setLayer, fadeIn, fadeOut } = useAudioEngine(notchHz)
  const dimTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load notch Hz
  useEffect(() => {
    try {
      const s = loadOnboardingState()
      if (s.frequencyHz) setNotchHz(s.frequencyHz)
    } catch {}
  }, [])

  // Live clock
  useEffect(() => {
    function updateClock() {
      const now = new Date()
      setClock(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }
    updateClock()
    const id = setInterval(updateClock, 10000)
    return () => clearInterval(id)
  }, [])

  // Morning prompt check
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SLEEP_SESSION_KEY)
      if (!raw) return
      const session = JSON.parse(raw) as { date: string; rated: boolean }
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      if (session.date === yesterday && !session.rated) {
        setShowMorningPrompt(true)
      }
    } catch {}
  }, [])

  // Screen dim: reset timer on any interaction
  const resetDimTimer = useCallback(() => {
    setDimmed(false)
    if (dimTimerRef.current) clearTimeout(dimTimerRef.current)
    if (isPlaying) {
      dimTimerRef.current = setTimeout(() => setDimmed(true), 30000)
    }
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying) { setDimmed(false); return }
    resetDimTimer()
    const events = ["mousemove", "touchstart", "keydown", "click"]
    events.forEach((e) => window.addEventListener(e, resetDimTimer, { passive: true }))
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetDimTimer))
      if (dimTimerRef.current) clearTimeout(dimTimerRef.current)
    }
  }, [isPlaying, resetDimTimer])

  // Countdown timer
  useEffect(() => {
    if (countdownRef.current) clearInterval(countdownRef.current)
    if (fadeMinutes !== null && isPlaying) {
      const endAt = Date.now() + fadeMinutes * 60 * 1000
      setTimerRemaining(fadeMinutes * 60)
      countdownRef.current = setInterval(() => {
        const rem = Math.max(0, Math.round((endAt - Date.now()) / 1000))
        setTimerRemaining(rem)
        if (rem === 0) {
          fadeOut(30) // 30 second slow fade for sleep
          setTimeout(() => setIsPlaying(false), 30000)
          if (countdownRef.current) clearInterval(countdownRef.current)
        }
      }, 1000)
    } else {
      setTimerRemaining(null)
    }
    return () => { if (countdownRef.current) clearInterval(countdownRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fadeMinutes, isPlaying])

  function startSleep() {
    const p = SLEEP_PRESETS[selectedPreset]
    p.layers.forEach((l, i) => setLayer(i as 0 | 1 | 2, l.type, l.volume))
    fadeIn(4) // slow 4-second fade in for sleep
    setIsPlaying(true)
    // Log sleep session start
    try {
      localStorage.setItem(
        SLEEP_SESSION_KEY,
        JSON.stringify({ date: new Date().toISOString().slice(0, 10), rated: false })
      )
    } catch {}
  }

  function stopSleep() {
    fadeOut(2, () => setIsPlaying(false))
  }

  function submitMorningRating(rating: number) {
    try {
      const raw = localStorage.getItem(SLEEP_SESSION_KEY)
      if (raw) {
        const s = JSON.parse(raw)
        localStorage.setItem(SLEEP_SESSION_KEY, JSON.stringify({ ...s, rated: true, rating }))
      }
      // Also save to checkin storage for dashboard
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      localStorage.setItem(`tinni_sleep_rating_${yesterday}`, String(rating))
    } catch {}
    setMorningDone(true)
    setTimeout(() => setShowMorningPrompt(false), 2000)
  }

  function formatRemaining(sec: number): string {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    return `${m}:${String(s).padStart(2, "0")}`
  }

  return (
    <div
      className="min-h-screen bg-[#04040A] text-white flex flex-col select-none transition-opacity duration-[3000ms]"
      style={{ opacity: dimmed ? 0.04 : 1 }}
      onClick={dimmed ? () => setDimmed(false) : undefined}
    >
      {/* Morning prompt */}
      <AnimatePresence>
        {showMorningPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D18] border-b border-white/10 px-5 py-4"
          >
            {morningDone ? (
              <div className="flex items-center gap-3 text-emerald-400">
                <Sun className="w-5 h-5" />
                <span className="font-medium">Logged — have a good day.</span>
              </div>
            ) : (
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-white/80">How did you sleep last night?</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => submitMorningRating(n)}
                      className={`transition-all duration-150 ${
                        morningRating >= n ? "text-amber-400 scale-110" : "text-white/20 hover:text-white/50"
                      }`}
                      onMouseEnter={() => setMorningRating(n)}
                      onMouseLeave={() => setMorningRating(0)}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowMorningPrompt(false)}
                  className="ml-auto text-white/25 hover:text-white/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto w-full">
        {/* Clock */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-serif text-6xl font-light text-white/90 mb-2 tracking-wider"
        >
          {clock}
        </motion.div>
        <p className="text-white/25 text-sm mb-10">
          {isPlaying ? "Playing — screen will dim" : "Wind down and rest"}
        </p>

        {/* Soundscape presets */}
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-6"
          >
            <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest mb-3 text-center">
              Soundscape
            </p>
            <div className="flex gap-2 justify-center">
              {SLEEP_PRESETS.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => setSelectedPreset(i)}
                  className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border-2 transition-all duration-200 flex-1 max-w-[110px] ${
                    selectedPreset === i
                      ? "border-indigo-500/50 bg-indigo-500/12 text-white"
                      : "border-white/8 bg-white/4 text-white/45 hover:border-white/18"
                  }`}
                >
                  <span className="text-xl">{p.emoji}</span>
                  <span className="text-xs font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Playing state: minimal waveform bars */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-end gap-1 h-10 mb-8"
          >
            {Array.from({ length: 7 }, (_, i) => (
              <motion.div
                key={i}
                animate={{ height: [6, 18 + Math.random() * 14, 6] }}
                transition={{
                  duration: 1.2 + Math.random() * 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
                className="w-1.5 bg-indigo-400/50 rounded-full"
                style={{ height: 6 }}
              />
            ))}
          </motion.div>
        )}

        {/* Fade timer selector (only visible when not playing) */}
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 mb-8"
          >
            {FADE_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setFadeMinutes(opt.minutes)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                  fadeMinutes === opt.minutes
                    ? "border-indigo-500/40 bg-indigo-500/12 text-indigo-300"
                    : "border-white/8 bg-white/4 text-white/35 hover:border-white/18"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Timer remaining */}
        {timerRemaining !== null && (
          <div className="text-sm text-white/30 mb-6 font-mono">
            Fades out in {formatRemaining(timerRemaining)}
          </div>
        )}

        {/* Play / Stop button */}
        <button
          onClick={isPlaying ? stopSleep : startSleep}
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 mb-8 ${
            isPlaying
              ? "bg-white/8 border border-white/12 hover:bg-white/12"
              : "bg-indigo-600/80 hover:bg-indigo-500/80 shadow-indigo-900/60"
          }`}
        >
          {isPlaying ? (
            <Square className="w-7 h-7 text-white/60 fill-white/60" />
          ) : (
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          )}
        </button>

        {/* Body scan toggle */}
        <button
          onClick={() => { setBodyScanOpen((v) => !v); setBodyScanStep(0) }}
          className="text-xs text-white/25 hover:text-white/50 transition-colors underline underline-offset-2"
        >
          {bodyScanOpen ? "Hide" : "Optional: 10-min body scan guide"}
        </button>
      </div>

      {/* Body scan panel */}
      <AnimatePresence>
        {bodyScanOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-[#08081A] border-t border-white/8 px-5 py-5 max-h-[45vh] overflow-y-auto"
          >
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-0.5">
                    Body Scan · {bodyScanStep + 1} of {BODY_SCAN_STEPS.length}
                  </p>
                  <h3 className="font-serif text-lg font-medium text-white">
                    {BODY_SCAN_STEPS[bodyScanStep].title}
                  </h3>
                </div>
                <button
                  onClick={() => setBodyScanOpen(false)}
                  className="text-white/25 hover:text-white/50 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress dots */}
              <div className="flex gap-1 mb-4">
                {BODY_SCAN_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                      i <= bodyScanStep ? "bg-indigo-500" : "bg-white/12"
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={bodyScanStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="text-white/65 text-sm leading-relaxed mb-5"
                >
                  {BODY_SCAN_STEPS[bodyScanStep].text}
                </motion.p>
              </AnimatePresence>

              <div className="flex items-center justify-between">
                {bodyScanStep > 0 ? (
                  <button
                    onClick={() => setBodyScanStep((s) => s - 1)}
                    className="text-xs text-white/25 hover:text-white/50 transition-colors"
                  >
                    ← Back
                  </button>
                ) : <div />}

                {bodyScanStep < BODY_SCAN_STEPS.length - 1 ? (
                  <button
                    onClick={() => setBodyScanStep((s) => s + 1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600/60 hover:bg-indigo-500/60 text-white text-sm font-medium transition-all"
                  >
                    Continue <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setBodyScanOpen(false)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600/60 hover:bg-emerald-500/60 text-white text-sm font-medium transition-all"
                  >
                    <Moon className="w-3.5 h-3.5" /> Rest now
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
