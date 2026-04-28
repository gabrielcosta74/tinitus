"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Waves, MessageCircle, Moon, TrendingUp } from "lucide-react"

const TILES = [
  {
    href: "/sounds",
    icon: Waves,
    label: "Sound Therapy",
    description: "Notch & masking",
    bg: "bg-teal-50 dark:bg-teal-950/30",
    border: "border-teal-200/50 dark:border-teal-900/50",
    iconColor: "text-teal-600 dark:text-teal-400",
    iconBg: "bg-teal-100 dark:bg-teal-900/50",
  },
  {
    href: "/coach",
    icon: MessageCircle,
    label: "AI Coach",
    description: "CBT exercises",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    border: "border-indigo-200/50 dark:border-indigo-900/50",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/50",
  },
  {
    href: "/sleep",
    icon: Moon,
    label: "Sleep",
    description: "Wind-down audio",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200/50 dark:border-purple-900/50",
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-100 dark:bg-purple-900/50",
  },
  {
    href: "/progress",
    icon: TrendingUp,
    label: "Progress",
    description: "THI over time",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200/50 dark:border-amber-900/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
  },
]

export function QuickAccessTiles() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {TILES.map(({ href, icon: Icon, label, description, bg, border, iconColor, iconBg }) => (
        <Link key={href} href={href} className="outline-none block">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className={`h-full group relative overflow-hidden rounded-3xl ${bg} border ${border} p-5 flex flex-col gap-4 shadow-sm transition-colors duration-300`}
          >
            <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center transition-colors duration-300`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
              <p className="text-foreground font-bold text-[15px] leading-tight">{label}</p>
              <p className="text-foreground/50 text-xs mt-1 font-medium">{description}</p>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  )
}

