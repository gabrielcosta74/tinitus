"use client"

import { Sidebar } from "@/components/app/Sidebar"
import { BottomNav } from "@/components/app/BottomNav"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar />
      {/* Main content — offset for sidebar on large screens */}
      <main className="lg:ml-60 pb-20 lg:pb-0 min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
