"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function Problem() {
  const points = [
    {
      title: "The silence is gone.",
      description: "It's the first thing you hear when you wake up, and the last thing keeping you awake at 3 AM. The exhaustion is compounding.",
    },
    {
      title: "Focus is slipping.",
      description: "Conversations are harder to follow. Reading a book feels impossible. The ringing demands your attention, leaving little for anything else.",
    },
    {
      title: "Hope feels lost.",
      description: "\"Just learn to live with it\" is the only advice you've been given. You've tried the supplements, the videos, the white noise. Nothing sticks.",
    },
  ]

  return (
    <section className="py-24 md:py-32 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative w-full aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden shadow-xl"
          >
            <Image 
              src="https://images.unsplash.com/photo-1515023115689-589c33041d3c?q=80&w=1200&auto=format&fit=crop"
              alt="Person looking thoughtfully out a window, representing the internal struggle"
              fill
              className="object-cover grayscale-[20%]"
            />
          </motion.div>

          {/* Content Side */}
          <div className="max-w-xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="font-serif text-3xl md:text-5xl font-medium mb-12 text-foreground tracking-tight leading-tight"
            >
              We know what it feels like to have the quiet stolen from you.
            </motion.h2>

            <div className="space-y-8 mb-12">
              {points.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="space-y-2 border-l-2 border-primary/30 pl-6 py-1"
                >
                  <h3 className="font-serif text-xl font-medium">{point.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">{point.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-8 rounded-2xl bg-background border border-border/50 shadow-sm"
            >
              <p className="text-xl md:text-2xl font-serif text-foreground/90 leading-relaxed text-balance">
                There&apos;s a scientifically proven path to relief. <br />
                It used to cost €4,000 and require weekly clinic visits. <br />
                <span className="text-primary font-medium mt-2 block">Now it&apos;s on your phone.</span>
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
