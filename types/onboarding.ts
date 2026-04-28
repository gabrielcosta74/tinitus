export interface TinnitusProfile {
  duration: string
  sounds: string[]
  impacts: string[]
  hearingLoss: string
  stressLevel: number
}

export type THIAnswer = 0 | 2 | 4

export interface OnboardingState {
  profile: TinnitusProfile | null
  thiAnswers: Record<number, THIAnswer>
  thiScore: number | null
  frequencyHz: number | null
  lastStep?: number
}
