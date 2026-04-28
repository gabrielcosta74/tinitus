"use client"

import { motion } from "framer-motion"
import { ArrowRight, FileText } from "lucide-react"
import Link from "next/link"

export function Science() {
  const stats = [
    { value: "91%", label: "Responder rate" },
    { value: "42%", label: "Average distress reduction" },
    { value: "600+", label: "Trial participants" },
    { value: "12", label: "Weeks to clinical improvement" },
  ]

  const citations = [
    "Cochrane Review",
    "Nature Communications",
    "JAMA Otolaryngology",
  ]

  return (
    <section className="dark bg-background text-foreground py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight mb-6">
              Rooted in peer-reviewed science.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Tinni isn&apos;t a wellness app. It&apos;s a digital therapeutic based on the exact protocols used in the world&apos;s leading audiology clinics. 
              The combination of Cognitive Behavioural Therapy (CBT) and targeted sound therapy is the only evidence-based treatment for subjective tinnitus.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-10">
              {citations.map((citation, i) => (
                <div key={i} className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/20 px-4 py-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  {citation}
                </div>
              ))}
            </div>

            <Link href="#" className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors group">
              Read the clinical methodology
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-l-2 border-primary/50 pl-6 py-2"
              >
                <div className="font-serif text-4xl md:text-6xl font-medium text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
