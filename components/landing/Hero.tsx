"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShieldCheck, MessageCircle, TrendingDown, Bell } from "lucide-react"

export function Hero() {
  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format",
  ]

  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-background min-h-[90vh] flex items-center">
      
      {/* Dynamic Fluid Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            x: ["-10%", "5%", "-10%"],
            y: ["10%", "-5%", "10%"],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: ["10%", "-10%", "10%"],
            y: ["-10%", "5%", "-10%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px]"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Conversion */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium mb-8"
            >
              <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
              <span className="text-foreground/90">FDA-Approved Clinical Science</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-medium tracking-tight mb-6 leading-[1.05] text-foreground text-balance"
            >
              Silence the noise. <br />
              <span className="text-muted-foreground italic font-light">Reclaim your life.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed font-sans"
            >
              The first digital therapeutic combining clinical CBT, personalised notch therapy, and an AI coach. <strong>91% of users see measurable improvement in 12 weeks.</strong>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link href="/onboarding">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg shadow-lg shadow-primary/20">
                  Start free assessment
                </Button>
              </Link>
              
              {/* Avatar Hook */}
              <div className="flex items-center gap-3 mt-4 sm:mt-0 sm:ml-4">
                <div className="flex -space-x-3">
                  {avatars.map((src, i) => (
                    <div key={i} className="relative w-10 h-10 rounded-full border-2 border-background overflow-hidden flex items-center justify-center">
                      <Image src={src} alt="User" fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col text-sm">
                  <div className="flex text-accent">{"★".repeat(5)}</div>
                  <span className="font-medium text-foreground">12,000+ finding relief</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Floating UI Mockups */}
          <div className="lg:col-span-6 relative h-[500px] hidden md:block">
            
            {/* Background Glow for UI */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/50 rounded-full blur-[80px] pointer-events-none" />

            {/* Mockup 1: THI Chart (Top Right) */}
            <motion.div
              initial={{ opacity: 0, x: 50, y: 50 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute top-10 right-0 w-[340px] bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 z-10"
              style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5) inset" }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-serif font-medium text-lg">Clinical Outcome</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1">THI Score (12 Weeks)</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-primary" />
                </div>
              </div>
              
              {/* Fake Chart */}
              <div className="flex items-end gap-2 h-32 mt-4 border-b border-border/50 pb-2">
                {[68, 62, 54, 45, 38, 30, 22].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 group">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                      className={`w-full rounded-t-md ${i === 6 ? 'bg-primary' : 'bg-primary/20'}`} 
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground font-medium mt-3">
                <span>Week 1 (Severe)</span>
                <span className="text-primary">Week 12 (Mild)</span>
              </div>
            </motion.div>

            {/* Mockup 2: AI Coach Interface (Bottom Left) */}
            <motion.div
              initial={{ opacity: 0, x: -50, y: -50 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute bottom-10 left-0 w-[360px] bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-5 z-20"
              style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.8) inset" }}
            >
              <div className="flex items-center gap-4 mb-5 border-b border-border/40 pb-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-accent" />
                  </div>
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-serif font-medium text-lg leading-tight">Tinni AI Coach</h3>
                  <p className="text-xs font-medium text-green-600">Online • Knows your profile</p>
                </div>
                <Bell className="h-5 w-5 text-muted-foreground ml-auto" />
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex-shrink-0 flex items-center justify-center mt-1">
                    <span className="text-xs font-bold text-accent">AI</span>
                  </div>
                  <div className="bg-muted/50 rounded-2xl rounded-tl-none p-3 text-sm text-foreground leading-relaxed">
                    Good evening. I noticed your sleep was disrupted last night. Ready for a 10-minute targeted notch therapy session before bed?
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-3 text-sm leading-relaxed">
                    Yes, please. The ringing is a bit loud tonight.
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
