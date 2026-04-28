"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  PlayCircle,
  Waves,
  MessageCircle,
  TrendingUp,
  Moon,
  Settings,
  Ear,
  LogOut,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/session", label: "Session", icon: PlayCircle },
  { href: "/sounds", label: "Sounds", icon: Waves },
  { href: "/coach", label: "Coach", icon: MessageCircle },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/sleep", label: "Sleep", icon: Moon },
] as const

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
    })
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth")
    router.refresh()
  }

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col bg-card border-r border-border z-40 shadow-sm transition-colors duration-300">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
            <Ear className="w-5 h-5 text-primary" />
          </div>
          <span className="font-serif text-2xl font-bold text-primary tracking-tight">Tinni.</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group outline-none ${
                isActive
                  ? "text-primary font-semibold"
                  : "text-foreground/60 hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-2xl bg-primary/10 border border-primary/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={`w-5 h-5 relative z-10 transition-colors ${
                  isActive ? "text-primary" : "text-foreground/40 group-hover:text-foreground/70"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="relative z-10">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 pb-6 border-t border-border pt-4 space-y-2">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
            pathname === "/settings"
              ? "text-primary bg-primary/10 border border-primary/10 font-semibold"
              : "text-foreground/60 hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Settings className="w-5 h-5" strokeWidth={pathname === "/settings" ? 2.5 : 2} />
          Settings
        </Link>

        <div className="mt-4 px-4 py-3.5 rounded-2xl bg-muted/30 border border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
            {userEmail ? userEmail[0].toUpperCase() : "T"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-foreground truncate leading-tight">
              {userEmail ?? "My Account"}
            </div>
            <div className="text-xs text-foreground/50 mt-0.5 font-medium">My Programme</div>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="text-foreground/30 hover:text-foreground/70 transition-colors flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

