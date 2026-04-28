"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { saveOnboardingState, loadOnboardingState } from "@/lib/onboarding-storage"
import type { OnboardingState, THIAnswer } from "@/types/onboarding"
import { THI_QUESTIONS, calculateTHIScore } from "@/lib/thi"

import { QuestionLayout } from "@/components/onboarding/QuestionLayout"
import { SingleChoice } from "@/components/onboarding/questions/SingleChoice"
import { MultiChoice } from "@/components/onboarding/questions/MultiChoice"
import { StressSlider } from "@/components/onboarding/questions/StressSlider"
import { FrequencyMatch } from "@/components/onboarding/questions/FrequencyMatch"
import { AnalysisLoading } from "@/components/onboarding/questions/AnalysisLoading"
import { Step4Results } from "@/components/onboarding/Step4Results" // We will rename/refactor this next

const DURATIONS = [
  { value: "less-6m", label: "Under 6 months", sub: "Recent onset" },
  { value: "6m-1y", label: "6–12 months", sub: "Establishing" },
  { value: "1y-5y", label: "1–5 years", sub: "Chronic" },
  { value: "5y+", label: "5+ years", sub: "Long-term" },
]

const SOUNDS = [
  { value: "Ringing", label: "Ringing" },
  { value: "Buzzing", label: "Buzzing" },
  { value: "Hissing", label: "Hissing" },
  { value: "Whistling", label: "Whistling" },
  { value: "Roaring", label: "Roaring" },
  { value: "Clicking", label: "Clicking" },
  { value: "Pulsing", label: "Pulsing" },
  { value: "Humming", label: "Humming" },
]

const IMPACTS = [
  { value: "Sleep", label: "Sleep" },
  { value: "Concentration", label: "Concentration" },
  { value: "Mood", label: "Mood" },
  { value: "Social life", label: "Social life" },
  { value: "Work / study", label: "Work / study" },
  { value: "Relationships", label: "Relationships" },
  { value: "Anxiety", label: "Anxiety" },
  { value: "Enjoying quiet", label: "Enjoying quiet" },
]

const HEARING_LOSS = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
  { value: "unsure", label: "Not sure" },
]

const THI_OPTIONS = [
  { value: 4, label: "Yes", sub: "Always / Definitely" },
  { value: 2, label: "Sometimes", sub: "Occasionally" },
  { value: 0, label: "No", sub: "Never" },
]

const TOTAL_STEPS = 34

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward
  
  const [state, setState] = useState<OnboardingState>({
    profile: {
      duration: "",
      sounds: [],
      impacts: [],
      hearingLoss: "",
      stressLevel: 3,
    },
    thiAnswers: {},
    thiScore: null,
    frequencyHz: 3000,
  })
  
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = loadOnboardingState()
    if (saved.profile) {
      setState({
        profile: saved.profile ?? { duration: "", sounds: [], impacts: [], hearingLoss: "", stressLevel: 3 },
        thiAnswers: (saved.thiAnswers as Record<number, THIAnswer>) ?? {},
        thiScore: saved.thiScore ?? null,
        frequencyHz: saved.frequencyHz ?? 3000,
        lastStep: saved.lastStep,
      })
      if (saved.lastStep !== undefined) {
        setStep(saved.lastStep)
      }
    }
    setHydrated(true)
  }, [])

  function advance(nextState: OnboardingState, jump = 1) {
    setDirection(1)
    const nextStep = step + jump
    const finalState = { ...nextState, lastStep: nextStep }
    setState(finalState)
    saveOnboardingState(finalState)
    setStep(nextStep)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function goBack() {
    if (step > 0) {
      setDirection(-1)
      const nextStep = step - 1
      setStep(nextStep)
      saveOnboardingState({ ...state, lastStep: nextStep })
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // --- Render Steps ---
  
  let content = null

  if (step === 0) {
    content = (
      <QuestionLayout title="How long have you had tinnitus?">
        <SingleChoice
          columns={2}
          options={DURATIONS}
          value={state.profile?.duration}
          onChange={(val) => advance({ ...state, profile: { ...state.profile!, duration: val as string } })}
        />
      </QuestionLayout>
    )
  } else if (step === 1) {
    content = (
      <QuestionLayout title="What does your tinnitus sound like?" subtitle="Select all that apply.">
        <MultiChoice
          options={SOUNDS}
          values={state.profile?.sounds || []}
          onChange={(val) => setState({ ...state, profile: { ...state.profile!, sounds: val } })}
          onContinue={() => advance(state)}
        />
      </QuestionLayout>
    )
  } else if (step === 2) {
    content = (
      <QuestionLayout title="What does it affect most?" subtitle="Select all that apply.">
        <MultiChoice
          options={IMPACTS}
          values={state.profile?.impacts || []}
          onChange={(val) => setState({ ...state, profile: { ...state.profile!, impacts: val } })}
          onContinue={() => advance(state)}
        />
      </QuestionLayout>
    )
  } else if (step === 3) {
    content = (
      <QuestionLayout title="Do you have diagnosed hearing loss?">
        <SingleChoice
          options={HEARING_LOSS}
          value={state.profile?.hearingLoss}
          onChange={(val) => advance({ ...state, profile: { ...state.profile!, hearingLoss: val as string } })}
        />
      </QuestionLayout>
    )
  } else if (step === 4) {
    content = (
      <QuestionLayout title="How would you rate your current stress level?">
        <StressSlider
          value={state.profile?.stressLevel || 3}
          onChange={(val) => setState({ ...state, profile: { ...state.profile!, stressLevel: val } })}
          onContinue={() => advance(state)}
        />
      </QuestionLayout>
    )
  } else if (step === 5) {
    content = (
      <QuestionLayout title="Tinnitus Handicap Inventory" subtitle="Next, we'll ask 25 questions used by audiologists worldwide to measure tinnitus severity. Answer honestly — there are no right or wrong answers.">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => advance(state)}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 mt-4"
        >
          Begin THI Assessment
        </motion.button>
      </QuestionLayout>
    )
  } else if (step >= 6 && step <= 30) {
    const qIndex = step - 6
    const questionText = THI_QUESTIONS[qIndex]
    
    content = (
      <QuestionLayout title={questionText}>
        <SingleChoice
          options={THI_OPTIONS}
          value={state.thiAnswers[qIndex]}
          onChange={(val) => {
            const newAnswers = { ...state.thiAnswers, [qIndex]: val as THIAnswer }
            const nextState = { ...state, thiAnswers: newAnswers }
            if (step === 30) {
              // Calculate score on the last THI question
              nextState.thiScore = calculateTHIScore(newAnswers)
            }
            advance(nextState)
          }}
        />
      </QuestionLayout>
    )
  } else if (step === 31) {
    content = (
      <QuestionLayout title="Frequency Matching" subtitle="Let's find the frequency that closest matches your tinnitus. This helps us personalize your sound therapy maskers. Make sure your volume is on.">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => advance(state)}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 mt-4"
        >
          Start Matching
        </motion.button>
      </QuestionLayout>
    )
  } else if (step === 32) {
    content = (
      <QuestionLayout title="Adjust the slider to match your pitch">
        <FrequencyMatch
          value={state.frequencyHz || 3000}
          onChange={(hz) => setState({ ...state, frequencyHz: hz })}
          onContinue={() => advance(state)}
        />
      </QuestionLayout>
    )
  } else if (step === 33) {
    content = (
      <AnalysisLoading onComplete={() => advance(state)} />
    )
  } else if (step === 34) {
    // We will refactor Step4Results into ResultsScreen
    content = (
      <Step4Results
        thiScore={state.thiScore!}
        frequencyHz={state.frequencyHz!}
        profile={state.profile!}
      />
    )
  }

  const progressPct = step === 34 ? 100 : (step / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col">
      {/* Header */}
      <header className="flex-none fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        <div className="max-w-2xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {step > 0 && step < 33 && (
              <button
                onClick={goBack}
                className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground/60" />
              </button>
            )}
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-primary">
              Tinni.
            </Link>
          </div>
          
          {step > 0 && step < 33 && (
            <div className="text-xs font-bold uppercase tracking-widest text-foreground/30">
              {step <= 4 ? "Profile" : step <= 30 ? `THI ${step - 5}/25` : "Audio"}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full flex items-center pt-16">
        <div className="w-full px-5">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

