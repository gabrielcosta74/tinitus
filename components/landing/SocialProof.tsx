"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

// Custom inline logos for guaranteed loading and crisp vector quality
const Logos = {
  NHS: () => (
    <div className="flex items-center justify-center bg-[#005EB8] text-white px-4 py-1 font-sans font-bold text-xl italic tracking-wider h-10">
      NHS
    </div>
  ),
  BBC: () => (
    <div className="flex items-center gap-1.5 h-10">
      <div className="flex gap-0.5">
        {['B', 'B', 'C'].map((letter, i) => (
          <div key={i} className="bg-foreground text-background w-7 h-7 flex items-center justify-center font-bold text-sm">
            {letter}
          </div>
        ))}
      </div>
      <span className="font-sans font-medium text-xl text-foreground mt-0.5">Health</span>
    </div>
  ),
  TheTimes: () => (
    <div className="font-serif font-bold text-2xl tracking-widest text-foreground uppercase h-10 flex items-center">
      The Times
    </div>
  ),
  AudiologyToday: () => (
    <div className="flex items-center gap-2 h-10">
      <div className="w-6 h-6 rounded-full border-2 border-foreground flex items-center justify-center">
        <div className="w-2 h-2 bg-foreground rounded-full"></div>
      </div>
      <span className="font-sans font-semibold text-lg tracking-tight text-foreground">
        Audiology Today
      </span>
    </div>
  ),
  TinnitusTalk: () => (
    <div className="flex items-center gap-2 h-10">
      <svg className="w-6 h-6 text-foreground" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
      <span className="font-sans font-black text-xl tracking-tighter text-foreground">
        Tinnitus<span className="font-light">Talk</span>
      </span>
    </div>
  )
}

export function SocialProof() {
  const logos = [
    <Logos.NHS key="nhs" />,
    <Logos.BBC key="bbc" />,
    <Logos.TheTimes key="times" />,
    <Logos.AudiologyToday key="audiology" />,
    <Logos.TinnitusTalk key="tinnitus" />
  ]

  // Double the array for infinite scroll
  const scrollLogos = [...logos, ...logos]

  return (
    <section className="py-16 md:py-20 border-y border-border/40 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-12">
          
          {/* Trust Rating */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="flex bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-accent text-accent" />
              ))}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-serif text-2xl font-semibold text-foreground">4.9/5</span>
              <span className="hidden sm:block text-muted-foreground">•</span>
              <span className="text-muted-foreground tracking-wide">Based on outcomes from <span className="font-semibold text-foreground">12,000+ patients</span></span>
            </div>
          </div>

          {/* Logo Carousel */}
          <div className="w-full overflow-hidden mask-image-fade max-w-5xl">
            <motion.div
              className="flex items-center space-x-20 md:space-x-32 w-max py-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 30,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {scrollLogos.map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform scale-90 md:scale-100"
                >
                  {logo}
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
      <style jsx global>{`
        .mask-image-fade {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </section>
  )
}
