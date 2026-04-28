import { saveSessionLog } from "./session-storage"
import type { SessionLog } from "@/types/session"
import { todayKey } from "./dashboard-storage"

export function logCompletedSession(
  module: string,
  therapyWeek: number,
  completedExercises: string[],
  durationMinutes: number
): void {
  const log: SessionLog = {
    date: todayKey(),
    module,
    therapyWeek,
    completedExercises,
    durationMinutes,
    completedAt: new Date().toISOString(),
  }
  saveSessionLog(log)
}
