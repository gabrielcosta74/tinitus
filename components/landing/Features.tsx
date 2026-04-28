"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Headphones, BrainCircuit, LineChart, Moon, BookOpen, FileText } from "lucide-react"

export function Features() {
  return (
    <section className="py-24 md:py-32 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight mb-6">
            Everything you need. <br />Nothing you don&apos;t.
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete clinical toolkit, elegantly designed and always in your pocket.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto auto-rows-[320px]">
          
          {/* Feature 1 - Large Span 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 rounded-3xl overflow-hidden relative group bg-background border border-border/50 shadow-sm"
          >
            <div className="absolute inset-0 z-0">
              <Image 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
                alt="Abstract waveform"
                fill
                className="object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500"
              />
            </div>
            <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-between">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-2xl md:text-3xl font-medium mb-3">Personalised Sound Therapy</h3>
                <p className="text-muted-foreground text-lg max-w-md">Generic white noise doesn&apos;t work. We map your specific frequency and apply a therapeutic notch filter.</p>
              </div>
            </div>
          </motion.div>

          {/* Feature 2 - Tall image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl overflow-hidden relative bg-accent/5 border border-border/50 shadow-sm"
          >
            <div className="p-8 md:p-10 h-full flex flex-col justify-between">
              <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <BrainCircuit className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-medium mb-3">AI Coach 24/7</h3>
                <p className="text-muted-foreground">A companion that knows your exact profile and history, available instantly.</p>
              </div>
            </div>
          </motion.div>

          {/* Feature 3 - Sleep Program with Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 rounded-3xl overflow-hidden relative bg-slate-900 text-white shadow-lg"
          >
            <div className="absolute inset-0 z-0">
              <Image 
                src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1200&auto=format&fit=crop"
                alt="Peaceful sleep at night"
                fill
                className="object-cover opacity-40 mix-blend-overlay"
              />
            </div>
            <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-between">
              <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                <Moon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-2xl md:text-3xl font-medium mb-3 text-white">Targeted Sleep Programme</h3>
                <p className="text-white/80 text-lg max-w-md">Access dedicated sleep protocols designed to lower your nervous system arousal and guide you back to rest.</p>
              </div>
            </div>
          </motion.div>

          {/* Feature 4 - CBT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-3xl p-8 md:p-10 bg-background border border-border/50 shadow-sm flex flex-col justify-between"
          >
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-medium mb-3">Science-Backed CBT</h3>
              <p className="text-muted-foreground">A 12-week Cognitive Behavioural Therapy programme built on Cochrane Review evidence.</p>
            </div>
          </motion.div>

          {/* Feature 5 - Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-3xl p-8 md:p-10 bg-background border border-border/50 shadow-sm flex flex-col justify-between"
          >
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-medium mb-3">Clinical Tracking</h3>
              <p className="text-muted-foreground">Track your progress using the gold-standard Tinnitus Handicap Inventory (THI).</p>
            </div>
          </motion.div>

          {/* Feature 6 - Reports span 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="md:col-span-2 rounded-3xl p-8 md:p-10 bg-muted/50 border border-border/50 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          >
            <div className="flex-1">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-medium mb-3">Clinician Reports</h3>
              <p className="text-muted-foreground text-lg max-w-sm">Generate PDF reports of your progress to share seamlessly with your audiologist.</p>
            </div>
            <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden relative shadow-sm border border-border/30">
              <Image 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
                alt="Data reports"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
