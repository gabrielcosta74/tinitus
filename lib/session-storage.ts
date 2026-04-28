import type { SessionLog } from "@/types/session"
import { todayKey } from "./dashboard-storage"

// --- Session log persistence ---
export function saveSessionLog(log: SessionLog): void {
  try {
    const existing = loadAllSessionLogs()
    // Replace today's if it exists, otherwise prepend
    const filtered = existing.filter((l) => l.date !== log.date)
    filtered.unshift(log)
    localStorage.setItem("tinni_session_logs", JSON.stringify(filtered.slice(0, 90)))
  } catch {}
}

export function loadAllSessionLogs(): SessionLog[] {
  try {
    const raw = localStorage.getItem("tinni_session_logs")
    return raw ? (JSON.parse(raw) as SessionLog[]) : []
  } catch {
    return []
  }
}

export function loadTodaySessionLog(): SessionLog | null {
  const today = todayKey()
  const logs = loadAllSessionLogs()
  return logs.find((l) => l.date === today) ?? null
}

export function getTotalSessionsCount(): number {
  return loadAllSessionLogs().length
}
