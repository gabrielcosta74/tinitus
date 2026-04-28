import type { OnboardingState, TinnitusProfile } from "@/types/onboarding"

const KEY = "tinni_onboarding_v1"

export function saveOnboardingState(patch: Partial<OnboardingState>): void {
  try {
    const current = loadOnboardingState()
    sessionStorage.setItem(KEY, JSON.stringify({ ...current, ...patch }))
  } catch {
    // sessionStorage unavailable (SSR or private mode)
  }
}

export function loadOnboardingState(): Partial<OnboardingState> {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function clearOnboardingState(): void {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

export function loadOnboardingProfile(): TinnitusProfile | null {
  const state = loadOnboardingState()
  return state.profile ?? null
}
