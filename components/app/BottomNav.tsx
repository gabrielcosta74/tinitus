"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  PlayCircle,
  Waves,
  MessageCircle,
  TrendingUp,
  Moon,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/session", label: "Session", icon: PlayCircle },
  { href: "/sounds", label: "Sounds", icon: Waves },
  { href: "/coach", label: "Coach", icon: MessageCircle },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/sleep", label: "Sleep", icon: Moon },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-sm">
      <nav className="flex items-center justify-between px-2 py-2 bg-background/80 backdrop-blur-2xl border border-border rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center w-12 h-12 rounded-full outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={`w-5 h-5 relative z-10 transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-foreground/40"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="sr-only">{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

