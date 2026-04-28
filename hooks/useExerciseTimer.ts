"use client"

import { useEffect, useRef, useCallback, useState } from "react"

interface UseExerciseTimerOptions {
  durationSeconds: number
  onComplete: () => void
  autoStart?: boolean
}

export function useExerciseTimer({ durationSeconds, onComplete, autoStart = true }: UseExerciseTimerOptions) {
  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(!autoStart)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const start = useCallback(() => setPaused(false), [])
  const pause = useCallback(() => setPaused(true), [])
  const reset = useCallback(() => { setElapsed(0); setPaused(true) }, [])

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1
        if (next >= durationSeconds) {
          clearInterval(intervalRef.current!)
          setTimeout(() => onCompleteRef.current(), 100)
          return durationSeconds
        }
        return next
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [paused, durationSeconds])

  const remaining = Math.max(0, durationSeconds - elapsed)
  const progress = elapsed / durationSeconds // 0-1

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${String(sec).padStart(2, "0")}`
  }

  return { elapsed, remaining, progress, paused, start, pause, reset, formatTime }
}
