"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-32 bg-primary text-primary-foreground">
      {/* Warm ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-serif text-4xl md:text-6xl font-medium tracking-tight mb-8">
              You&apos;ve been living with this long enough.
            </h2>
            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-12 text-balance font-light">
              Take the first step toward getting the silence back.
            </p>
            
            <Link href="/onboarding">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90 text-lg h-14 px-8 group">
                Start free assessment
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            
            <p className="mt-6 text-sm text-primary-foreground/60">
              Takes 3 minutes. No credit card required.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
