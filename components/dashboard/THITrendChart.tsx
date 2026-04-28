"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"
import type { CheckinData } from "@/types/dashboard"

interface Props {
  checkins: CheckinData[]
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function getLastNDays(n: number): string[] {
  const result: string[] = []
  const today = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    result.push(d.toISOString().slice(0, 10))
  }
  return result
}

export function THITrendChart({ checkins }: Props) {
  const last7Days = useMemo(() => getLastNDays(7), [])

  const dataByDate = useMemo(() => {
    const map: Record<string, CheckinData> = {}
    checkins.forEach((c) => { map[c.date] = c })
    return map
  }, [checkins])

  const points = useMemo(() =>
    last7Days.map((date) => ({
      date,
      distress: dataByDate[date]?.distress ?? null,
      loudness: dataByDate[date]?.loudness ?? null,
    })),
    [last7Days, dataByDate]
  )

  const filledDistress = points.filter((p) => p.distress !== null).map((p) => p.distress as number)
  const trend = filledDistress.length >= 2
    ? filledDistress[filledDistress.length - 1] - filledDistress[0]
    : 0

  const TrendIcon = trend < -0.5 ? TrendingDown : trend > 0.5 ? TrendingUp : Minus
  const trendColor = trend < -0.5 ? "text-teal-500" : trend > 0.5 ? "text-red-500" : "text-foreground/40"
  const trendLabel = trend < -0.5 ? "Improving" : trend > 0.5 ? "Rising" : "Stable"

  const svgW = 280
  const svgH = 100
  const padX = 16
  const padY = 12

  function xPos(i: number) {
    return padX + (i * (svgW - padX * 2)) / 6
  }
  function yPos(val: number) {
    return svgH - padY - ((val - 1) / 9) * (svgH - padY * 2)
  }

  const distressLinePath = useMemo(() => {
    const filled = points
      .map((p, i) => (p.distress !== null ? { i, v: p.distress } : null))
      .filter(Boolean) as { i: number; v: number }[]
    if (filled.length < 2) return ""
    return filled
      .map((pt, idx) =>
        idx === 0
          ? `M ${xPos(pt.i)} ${yPos(pt.v)}`
          : `L ${xPos(pt.i)} ${yPos(pt.v)}`
      )
      .join(" ")
  }, [points])

  const distressAreaPath = useMemo(() => {
    if (!distressLinePath) return ""
    const filled = points
      .map((p, i) => (p.distress !== null ? { i, v: p.distress } : null))
      .filter(Boolean) as { i: number; v: number }[]
    const first = filled[0]
    const last = filled[filled.length - 1]
    return `${distressLinePath} L ${xPos(last.i)} ${svgH} L ${xPos(first.i)} ${svgH} Z`
  }, [distressLinePath, points])

  const loudnessPath = useMemo(() => {
    const filled = points
      .map((p, i) => (p.loudness !== null ? { i, v: p.loudness } : null))
      .filter(Boolean) as { i: number; v: number }[]
    if (filled.length < 2) return ""
    return filled
      .map((pt, idx) =>
        idx === 0
          ? `M ${xPos(pt.i)} ${yPos(pt.v)}`
          : `L ${xPos(pt.i)} ${yPos(pt.v)}`
      )
      .join(" ")
  }, [points])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full bg-amber-500" />
            <span className="text-[11px] font-medium text-foreground/50">Distress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full bg-indigo-500 opacity-50" />
            <span className="text-[11px] font-medium text-foreground/50">Loudness</span>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
          <TrendIcon className="w-3.5 h-3.5" />
          {trendLabel}
        </div>
      </div>

      <div className="relative">
        {filledDistress.length === 0 ? (
          <div className="h-24 flex items-center justify-center">
            <p className="text-foreground/30 text-xs font-medium">Complete check-ins to see your trend</p>
          </div>
        ) : (
          <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} className="overflow-visible">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[3, 5, 7, 9].map((v) => (
              <line
                key={v}
                x1={padX} y1={yPos(v)}
                x2={svgW - padX} y2={yPos(v)}
                stroke="currentColor"
                className="text-border"
                strokeWidth="1"
              />
            ))}
            {loudnessPath && (
              <path
                d={loudnessPath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.3}
              />
            )}
            {distressAreaPath && (
              <motion.path
                d={distressAreaPath}
                fill="url(#areaGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            )}
            {distressLinePath && (
              <motion.path
                d={distressLinePath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            )}
            {points.map((p, i) =>
              p.distress !== null ? (
                <circle
                  key={`d-${i}`}
                  cx={xPos(i)} cy={yPos(p.distress)}
                  r="3.5" fill="#fdfcf8" stroke="#f59e0b" strokeWidth="2"
                />
              ) : null
            )}
          </svg>
        )}
        <div className="flex justify-between mt-3 px-4">
          {last7Days.map((date, i) => (
            <span key={i} className="text-[10px] font-medium text-foreground/40">
              {DAYS[new Date(date + "T12:00:00").getDay()]}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

