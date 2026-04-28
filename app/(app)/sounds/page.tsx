"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play, Square, Volume2, Timer, Brain, Leaf, Moon, AlertCircle,
  ChevronDown, Info, Zap,
} from "lucide-react"
import { useAudioEngine } from "@/hooks/useAudioEngine"
import { Waveform } from "@/components/sounds/Waveform"
import { SoundType, SOUND_LABELS, SOUND_DESCRIPTIONS } from "@/lib/audio-engine"
import { loadOnboardingState } from "@/lib/onboarding-storage"

// ─── Preset definitions ───────────────────────────────────────────────────────

interface PresetDef {
  label: string
  icon: React.ElementType
  description: string
  layers: [
    { type: SoundType | null; volume: number },
    { type: SoundType | null; volume: number },
    { type: SoundType | null; volume: number },
  ]
  timerMinutes: number | null
}

const PRESETS: Record<string, PresetDef> = {
  focus: {
    label: "Focus",
    icon: Brain,
    description: "Steady masking for concentration",
    layers: [
      { type: "brown", volume: 0.6 },
      { type: "fractal", volume: 0.25 },
      { type: null, volume: 0 },
    ],
    timerMinutes: null,
  },
  relax: {
    label: "Relax",
    icon: Leaf,
    description: "Nature sounds with alpha binaural",
    layers: [
      { type: "rain", volume: 0.55 },
      { type: "brown", volume: 0.3 },
      { type: "binaural-alpha", volume: 0.15 },
    ],
    timerMinutes: null,
  },
  sleep: {
    label: "Sleep",
    icon: Moon,
    description: "Ocean + theta binaural for deep sleep",
    layers: [
      { type: "ocean", volume: 0.55 },
      { type: "pink", volume: 0.3 },
      { type: "binaural-theta", volume: 0.15 },
    ],
    timerMinutes: 60,
  },
  crisis: {
    label: "Crisis",
    icon: AlertCircle,
    description: "Intensive masking for acute spikes",
    layers: [
      { type: "pink", volume: 0.75 },
      { type: "ocean", volume: 0.45 },
      { type: null, volume: 0 },
    ],
    timerMinutes: 20,
  },
}

const ALL_SOUNDS: (SoundType | null)[] = [
  null, "white", "pink", "brown", "rain", "ocean", "fractal",
  "binaural-alpha", "binaural-theta",
]

const TIMER_OPTIONS: { label: string; minutes: number | null }[] = [
  { label: "∞", minutes: null },
  { label: "15m", minutes: 15 },
  { label: "30m", minutes: 30 },
  { label: "60m", minutes: 60 },
  { label: "90m", minutes: 90 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

// ─── Layer selector row ───────────────────────────────────────────────────────

const LAYER_TRACK_COLOURS = ["#0d9488", "#7c3aed", "#d97706"]
const LAYER_DOT_CLASSES = [
  "bg-teal-500",
  "bg-violet-500",
  "bg-amber-500",
]

interface LayerSelectorProps {
  index: number
  currentType: SoundType | null
  volume: number
  onTypeChange: (type: SoundType | null) => void
  onVolumeChange: (vol: number) => void
}

function LayerSelector({ index, currentType, volume, onTypeChange, onVolumeChange }: LayerSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  return (
    <div className={`rounded-xl border px-4 py-3 transition-all duration-300 ${
      currentType ? "border-white/12 bg-[#111118]" : "border-white/6 bg-[#0D0D15]"
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${currentType ? LAYER_DOT_CLASSES[index] : "bg-white/15"}`} />
        <span className="text-xs font-semibold text-white/35 uppercase tracking-wider w-14">
          Layer {index + 1}
        </span>

        {/* Dropdown */}
        <div ref={ref} className="relative flex-1">
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-white/6 border border-white/8 text-sm text-white/75 hover:bg-white/10 transition-all"
          >
            <span>{currentType ? SOUND_LABELS[currentType] : "Off"}</span>
            <ChevronDown className={`w-3 h-3 text-white/30 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.12 }}
                className="absolute left-0 top-full mt-1 z-50 w-full min-w-[200px] bg-[#181825] border border-white/10 rounded-xl shadow-2xl overflow-y-auto max-h-64"
              >
                {ALL_SOUNDS.map((s) => (
                  <button
                    key={s ?? "off"}
                    onClick={() => { onTypeChange(s); setOpen(false) }}
                    className={`w-full text-left px-4 py-2.5 transition-colors ${
                      s === currentType
                        ? "bg-teal-500/15 text-teal-300"
                        : "text-white/65 hover:bg-white/6 hover:text-white"
                    }`}
                  >
                    <div className="text-sm font-medium">{s ? SOUND_LABELS[s] : "Off"}</div>
                    {s && (
                      <div className="text-[10px] text-white/28 mt-0.5">{SOUND_DESCRIPTIONS[s]}</div>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Volume inline */}
        {currentType && (
          <div className="flex items-center gap-2 w-32 flex-shrink-0">
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
              className="flex-1 h-1 appearance-none rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${LAYER_TRACK_COLOURS[index]} ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%)`,
              }}
            />
            <span className="text-xs text-white/25 w-7 text-right">{Math.round(volume * 100)}%</span>
          </div>
        )}
      </div>

      {(currentType === "binaural-alpha" || currentType === "binaural-theta") && (
        <div className="mt-2 ml-5 flex items-center gap-1.5 text-[10px] text-amber-400/60">
          <Info className="w-3 h-3 flex-shrink-0" />
          Requires headphones for the binaural effect
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SoundsPage() {
  const [notchHz, setNotchHz] = useState<number | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [masterVol, setMasterVol] = useState(0.85)
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null)
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { engine, layers, setLayer, setLayerVolume, setMasterVolume, fadeIn, fadeOut } =
    useAudioEngine(notchHz)

  useEffect(() => {
    try {
      const state = loadOnboardingState()
      if (state.frequencyHz) setNotchHz(state.frequencyHz)
    } catch {}
  }, [])

  // Timer logic
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (timerMinutes !== null && isPlaying) {
      const endAt = Date.now() + timerMinutes * 60 * 1000
      setTimerRemaining(timerMinutes * 60)
      timerRef.current = setInterval(() => {
        const rem = Math.max(0, Math.round((endAt - Date.now()) / 1000))
        setTimerRemaining(rem)
        if (rem === 0) {
          fadeOut(8)
          setTimeout(() => setIsPlaying(false), 8000)
          if (timerRef.current) clearInterval(timerRef.current)
        }
      }, 1000)
    } else {
      setTimerRemaining(null)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerMinutes, isPlaying])

  const handlePlayPause = useCallback(() => {
    if (!isPlaying) {
      const anyActive = layers.some((l) => l.type !== null)
      if (!anyActive) {
        PRESETS.focus.layers.forEach((l, i) => setLayer(i as 0 | 1 | 2, l.type, l.volume))
        setActivePreset("focus")
      }
      fadeIn(2)
      setIsPlaying(true)
    } else {
      fadeOut(1.5, () => setIsPlaying(false))
    }
  }, [isPlaying, layers, fadeIn, fadeOut, setLayer])

  function applyPreset(key: string) {
    const p = PRESETS[key]
    if (!p) return
    setActivePreset(key)
    p.layers.forEach((l, i) => setLayer(i as 0 | 1 | 2, l.type, l.volume))
    if (p.timerMinutes !== null) setTimerMinutes(p.timerMinutes)
    if (!isPlaying) {
      fadeIn(2)
      setIsPlaying(true)
    }
  }

  const timerPct =
    timerMinutes !== null && timerRemaining !== null
      ? timerRemaining / (timerMinutes * 60)
      : 1

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-white/[0.05] px-5 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-bold text-white">Sound Therapy</h1>
          <p className="text-white/35 text-xs mt-0.5">Personalised to your tinnitus profile</p>
        </div>
        {notchHz && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-400">
            <Zap className="w-3 h-3" />
            Notch {notchHz >= 1000 ? `${(notchHz / 1000).toFixed(1)}kHz` : `${notchHz}Hz`}
          </div>
        )}
      </header>

      <div className="px-4 py-5 max-w-2xl mx-auto space-y-5 pb-24 lg:pb-8">
        {/* Waveform */}
        <div className="h-20 rounded-2xl bg-[#0D0D15] border border-white/6 overflow-hidden relative">
          <Waveform engine={engine} isActive={isPlaying} className="absolute inset-0" />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-xs text-white/18 font-medium">Press play to begin</p>
            </div>
          )}
        </div>

        {/* Master controls */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0D0D15] border border-white/6">
          <button
            onClick={handlePlayPause}
            className={`w-13 h-13 w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-300 ${
              isPlaying
                ? "bg-teal-500 shadow-teal-500/25 scale-105"
                : "bg-white/10 border border-white/12 hover:bg-white/15"
            }`}
          >
            {isPlaying ? (
              <Square className="w-5 h-5 text-white fill-white" />
            ) : (
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white/30 flex items-center gap-1.5">
                <Volume2 className="w-3 h-3" /> Master
              </span>
              <span className="text-xs text-white/40">{Math.round(masterVol * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(masterVol * 100)}
              onChange={(e) => {
                const v = Number(e.target.value) / 100
                setMasterVol(v)
                setMasterVolume(v)
              }}
              className="w-full h-1.5 appearance-none rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, #0d9488 ${masterVol * 100}%, rgba(255,255,255,0.1) ${masterVol * 100}%)`,
              }}
            />
          </div>

          {timerRemaining !== null && (
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="relative w-11 h-11">
                <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                  <circle
                    cx="22" cy="22" r="18" fill="none" stroke="#0d9488" strokeWidth="3"
                    strokeDasharray={`${2 * Math.PI * 18}`}
                    strokeDashoffset={`${2 * Math.PI * 18 * (1 - timerPct)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Timer className="w-3.5 h-3.5 text-teal-400" />
                </div>
              </div>
              <span className="text-[9px] text-teal-400 mt-0.5 font-mono">{formatTime(timerRemaining)}</span>
            </div>
          )}
        </div>

        {/* Presets */}
        <div>
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-2.5">Presets</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(PRESETS).map(([key, p]) => {
              const Icon = p.icon
              const active = activePreset === key
              return (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className={`flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                    active
                      ? "border-teal-500 bg-teal-500/10"
                      : "border-white/6 bg-[#0D0D15] hover:border-white/18 hover:bg-white/4"
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-2 ${active ? "text-teal-400" : "text-white/35"}`} />
                  <div className={`text-sm font-semibold ${active ? "text-white" : "text-white/65"}`}>{p.label}</div>
                  <div className="text-[10px] text-white/28 leading-tight mt-0.5">{p.description}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 3-layer mixer */}
        <div>
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-2.5">Mixer — 3 layers</p>
          <div className="space-y-2">
            {([0, 1, 2] as const).map((i) => (
              <LayerSelector
                key={i}
                index={i}
                currentType={layers[i].type}
                volume={layers[i].volume}
                onTypeChange={(type) => setLayer(i, type, layers[i].volume)}
                onVolumeChange={(vol) => setLayerVolume(i, vol)}
              />
            ))}
          </div>
        </div>

        {/* Timer selector */}
        <div>
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-2.5">Auto-stop</p>
          <div className="flex gap-2 flex-wrap">
            {TIMER_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setTimerMinutes(opt.minutes)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  timerMinutes === opt.minutes
                    ? "border-teal-500 bg-teal-500/15 text-teal-300"
                    : "border-white/8 bg-white/4 text-white/45 hover:border-white/18 hover:text-white/70"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notch filter info */}
        {notchHz ? (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-teal-500/5 border border-teal-500/12">
            <Zap className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-teal-300/65 leading-relaxed">
              A notch filter at{" "}
              <strong className="text-teal-300">
                {notchHz >= 1000 ? `${(notchHz / 1000).toFixed(1)} kHz` : `${notchHz} Hz`}
              </strong>{" "}
              is applied to every layer — your matched tinnitus frequency. This therapeutic gap prevents the brain from reinforcing the tinnitus signal while still providing masking relief.
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/3 border border-white/8">
            <Info className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-white/35 leading-relaxed">
              Complete the frequency matching in{" "}
              <a href="/onboarding" className="text-teal-400 underline">onboarding</a>{" "}
              to enable your personalised notch filter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
