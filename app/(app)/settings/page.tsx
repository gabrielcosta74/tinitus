"use client"

import { motion } from "framer-motion"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#080810] flex flex-col">
      <header className="sticky top-0 z-30 bg-[#080810]/90 backdrop-blur-xl border-b border-white/[0.06] px-5 py-4">
        <h1 className="text-white font-serif text-xl font-bold">Settings</h1>
        <p className="text-white/35 text-xs mt-0.5">Account & preferences</p>
      </header>
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/8 border border-white/10 flex items-center justify-center mx-auto">
            <Settings className="w-8 h-8 text-white/40" />
          </div>
          <h2 className="text-white font-serif text-2xl font-bold">Settings</h2>
          <p className="text-white/45 text-sm leading-relaxed">
            Account management, notification preferences, programme settings, and data export — built for Phase 8 alongside authentication.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/30 text-xs">
            Coming in Phase 8
          </div>
        </motion.div>
      </div>
    </div>
  )
}
