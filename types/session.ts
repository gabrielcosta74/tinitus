export type ExerciseType =
  | "psychoeducation"
  | "breathing"
  | "body-scan"
  | "cognitive-restructuring"
  | "attention-training"
  | "acceptance"
  | "sound-therapy"
  | "reflection"

export interface Exercise {
  id: string
  type: ExerciseType
  title: string
  durationSeconds: number
  content: ExerciseContent
}

export type ExerciseContent =
  | PsychoeducationContent
  | BreathingContent
  | BodyScanContent
  | CognitiveContent
  | AttentionContent
  | AcceptanceContent
  | SoundTherapyContent
  | ReflectionContent

export interface PsychoeducationContent {
  kind: "psychoeducation"
  slides: { heading: string; body: string }[]
}

export interface BreathingContent {
  kind: "breathing"
  pattern: { inhale: number; hold: number; exhale: number; holdOut?: number }
  cycles: number
  instruction: string
}

export interface BodyScanContent {
  kind: "body-scan"
  steps: { region: string; instruction: string; durationSeconds: number }[]
}

export interface CognitiveContent {
  kind: "cognitive-restructuring"
  thought: string
  challenge: string
  reframe: string
  affirmation: string
}

export interface AttentionContent {
  kind: "attention-training"
  instruction: string
  anchors: string[]
}

export interface AcceptanceContent {
  kind: "acceptance"
  metaphor: string
  practice: string
}

export interface SoundTherapyContent {
  kind: "sound-therapy"
  noiseType: "pink" | "brown" | "white"
  durationSeconds: number
  instruction: string
}

export interface ReflectionContent {
  kind: "reflection"
  prompt: string
  followUp: string
}

export interface SessionLog {
  date: string
  module: string
  therapyWeek: number
  completedExercises: string[]
  durationMinutes: number
  completedAt: string
}
