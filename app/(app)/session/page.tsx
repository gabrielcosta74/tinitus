"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, BookOpen, Wind, Volume2, Brain, Ear, Leaf, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { getExercisesForModule } from "@/lib/session-exercises"
import { logCompletedSession } from "@/lib/session-logger"
import { loadSessionPlan, calculateStreak, getTherapyWeek } from "@/lib/dashboard-storage"
import type { Exercise, ExerciseType } from "@/types/session"

import { PsychoeducationExercise } from "@/components/session/PsychoeducationExercise"
import { BreathingExercise } from "@/components/session/BreathingExercise"
import { SoundTherapyExercise } from "@/components/session/SoundTherapyExercise"
import { CognitiveRestructuringExercise } from "@/components/session/CognitiveRestructuringExercise"
import { AttentionTrainingExercise } from "@/components/session/AttentionTrainingExercise"
import { AcceptanceExercise } from "@/components/session/AcceptanceExercise"
import { ReflectionExercise } from "@/components/session/ReflectionExercise"
import { SessionComplete } from "@/components/session/SessionComplete"

const TYPE_ICONS: Record<ExerciseType, React.ReactNode> = {
  psychoeducation: <BookOpen className="w-4 h-4" />,
  breathing: <Wind className="w-4 h-4" />,
  "sound-therapy": <Volume2 className="w-4 h-4" />,
  "cognitive-restructuring": <Brain className="w-4 h-4" />,
  "attention-training": <Ear className="w-4 h-4" />,
  "body-scan": <Leaf className="w-4 h-4" />,
  acceptance: <Leaf className="w-4 h-4" />,
  reflection: <MessageSquare className="w-4 h-4" />,
}

const TYPE_LABELS: Record<ExerciseType, string> = {
  psychoeducation: "Learn",
  breathing: "Breathe",
  "sound-therapy": "Sound",
  "cognitive-restructuring": "Reframe",
  "attention-training": "Focus",
  "body-scan": "Scan",
  acceptance: "Accept",
  reflection: "Reflect",
}

function ExerciseRenderer({ exercise, onComplete }: { exercise: Exercise; onComplete: () => void }) {
  const { content } = exercise
  switch (content.kind) {
    case "psychoeducation":
      return <PsychoeducationExercise content={content} onComplete={onComplete} />
    case "breathing":
      return <BreathingExercise content={content} onComplete={onComplete} />
    case "sound-therapy":
      return <SoundTherapyExercise content={content} onComplete={onComplete} />
    case "cognitive-restructuring":
      return <CognitiveRestructuringExercise content={content} onComplete={onComplete} />
    case "attention-training":
      return <AttentionTrainingExercise content={content} onComplete={onComplete} />
    case "acceptance":
      return <AcceptanceExercise content={content} onComplete={onComplete} />
    case "reflection":
      return <ReflectionExercise content={content} onComplete={onComplete} />
    default:
      return (
        <div className="flex items-center justify-center h-full">
          <button onClick={onComplete} className="text-primary font-medium hover:underline">Continue</button>
        </div>
      )
  }
}

export default function SessionPage() {
  const router = useRouter()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [completed, setCompleted] = useState<string[]>([])
  const [sessionDone, setSessionDone] = useState(false)
  const [sessionModule, setSessionModule] = useState("Psychoeducation")
  const [therapyWeek, setTherapyWeek] = useState(1)
  const [streak, setStreak] = useState(0)
  const [mounted, setMounted] = useState(false)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    setMounted(true)
    const plan = loadSessionPlan()
    const tw = getTherapyWeek()
    const s = calculateStreak()
    const sessionMod = plan?.module ?? "Psychoeducation"
    setSessionModule(sessionMod)
    setTherapyWeek(tw)
    setStreak(s)

    const ex = getExercisesForModule(sessionMod, tw)
    setExercises(ex)
  }, [])

  function handleExerciseComplete() {
    const ex = exercises[currentIdx]
    const newCompleted = [...completed, ex.id]
    setCompleted(newCompleted)

    if (currentIdx < exercises.length - 1) {
      setCurrentIdx((i) => i + 1)
    } else {
      const durationMinutes = Math.round((Date.now() - startTimeRef.current) / 60000)
      logCompletedSession(sessionModule, therapyWeek, newCompleted, Math.max(1, durationMinutes))
      setSessionDone(true)
    }
  }

  if (!mounted) return null

  const currentExercise = exercises[currentIdx]
  const progress = exercises.length > 0 ? currentIdx / exercises.length : 0

  if (sessionDone) {
    return (
      <div className="min-h-screen bg-background">
        <SessionComplete
          module={sessionModule}
          durationMinutes={Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000))}
          exerciseCount={completed.length}
          streak={streak}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex-none px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4 max-w-lg mx-auto w-full">
          <div className="flex items-center gap-3">
            {currentIdx > 0 && (
              <button
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground/60" />
              </button>
            )}
            <div>
              <p className="text-foreground/50 text-[10px] font-bold uppercase tracking-widest">{sessionModule}</p>
              <p className="text-foreground font-bold text-[15px] leading-tight mt-0.5">
                {currentExercise?.title ?? "Loading…"}
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-5 h-5 text-foreground/60" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="max-w-lg mx-auto w-full">
          <div className="relative h-1.5 bg-muted rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="absolute inset-y-0 left-0 bg-primary rounded-full"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Exercise step bubbles */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {exercises.map((ex, i) => {
              const isDone = i < currentIdx
              const isCurrent = i === currentIdx
              return (
                <div
                  key={ex.id}
                  className={`flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-300 ${
                    isCurrent
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : isDone
                      ? "bg-muted border-border text-foreground/40"
                      : "bg-transparent border-dashed border-border text-foreground/30"
                  }`}
                >
                  <span className={`${isCurrent ? "text-primary-foreground" : isDone ? "text-foreground/40" : "text-foreground/30"}`}>
                    {TYPE_ICONS[ex.type]}
                  </span>
                  {isCurrent && TYPE_LABELS[ex.type]}
                  {isDone && "✓"}
                </div>
              )
            })}
          </div>
        </div>
      </header>

      {/* Exercise content */}
      <main className="flex-1 px-5 pb-8 overflow-y-auto w-full max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {currentExercise ? (
            <motion.div
              key={currentExercise.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full min-h-[65vh] flex flex-col"
            >
              <ExerciseRenderer exercise={currentExercise} onComplete={handleExerciseComplete} />
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[65vh]">
              <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

