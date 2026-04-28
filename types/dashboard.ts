export interface CheckinData {
  date: string // YYYY-MM-DD
  loudness: number // 1-10
  distress: number // 1-10
  sleepQuality: number // 1-10
  stress: number // 1-10
  triggers: string[]
  completedAt: string // ISO
}

export interface SessionPlan {
  duration: number
  module: string
  moduleDescription: string
  soundDuration: number
  tone: string
  approach: string
  affirmation: string
  therapyWeek: number
}

export interface WeeklyInsight {
  weekKey: string // YYYY-WW
  text: string
  generatedAt: string
}
