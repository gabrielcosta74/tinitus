import type { CheckinData, SessionPlan, WeeklyInsight } from "@/types/dashboard"

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function weekKey(): string {
  const d = new Date()
  const jan1 = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`
}

// --- Check-in ---
export function saveTodayCheckin(data: CheckinData): void {
  try {
    localStorage.setItem(`tinni_checkin_${todayKey()}`, JSON.stringify(data))
  } catch {}
}

export function loadTodayCheckin(): CheckinData | null {
  try {
    const raw = localStorage.getItem(`tinni_checkin_${todayKey()}`)
    return raw ? (JSON.parse(raw) as CheckinData) : null
  } catch {
    return null
  }
}

// --- Session plan ---
export function saveSessionPlan(plan: SessionPlan): void {
  try {
    localStorage.setItem(`tinni_session_${todayKey()}`, JSON.stringify(plan))
  } catch {}
}

export function loadSessionPlan(): SessionPlan | null {
  try {
    const raw = localStorage.getItem(`tinni_session_${todayKey()}`)
    return raw ? (JSON.parse(raw) as SessionPlan) : null
  } catch {
    return null
  }
}

// --- Weekly insight ---
export function saveWeeklyInsight(insight: WeeklyInsight): void {
  try {
    localStorage.setItem(`tinni_insight_${insight.weekKey}`, JSON.stringify(insight))
  } catch {}
}

export function loadWeeklyInsight(): WeeklyInsight | null {
  try {
    const raw = localStorage.getItem(`tinni_insight_${weekKey()}`)
    return raw ? (JSON.parse(raw) as WeeklyInsight) : null
  } catch {
    return null
  }
}

export function currentWeekKey(): string {
  return weekKey()
}

// --- Therapy week (which week of the 12-week programme the user is on) ---
export function getTherapyWeek(): number {
  try {
    return Number(localStorage.getItem("tinni_therapy_week") ?? "1") || 1
  } catch {
    return 1
  }
}

// --- Streak calculation ---
export function calculateStreak(): number {
  try {
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      if (localStorage.getItem(`tinni_checkin_${key}`)) {
        streak++
      } else {
        break
      }
    }
    return streak
  } catch {
    return 0
  }
}

// --- Recent check-in history (last N days) ---
export function loadRecentCheckins(days = 7): CheckinData[] {
  const result: CheckinData[] = []
  try {
    const today = new Date()
    for (let i = 0; i < days; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const raw = localStorage.getItem(`tinni_checkin_${key}`)
      if (raw) result.push(JSON.parse(raw) as CheckinData)
    }
  } catch {}
  return result
}
