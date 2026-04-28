"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function Testimonials() {
  const testimonials = [
    {
      name: "Marcus T.",
      age: "42",
      quote: "I was skeptical because I'd spent thousands on vitamins and weird ear devices that did nothing. The first three weeks with Tinni were hard, not gonna lie. But by week 8, the spike I used to get every evening just... stopped happening. My THI score dropped from 68 (Severe) to 22 (Mild). I can actually sit in a quiet room again without panicking.",
      outcome: "THI dropped 68 → 22",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "Sarah J.",
      age: "55",
      quote: "The sleep programme saved my sanity. I used to wake up at 3am and the ringing was deafening. The AI coach guided me through these specific grounding exercises while playing my notch-therapy sound. It feels like having a clinician in the room with you. Down from a THI of 74 to 30 in 12 weeks. I'm getting 7 straight hours of sleep now.",
      outcome: "THI dropped 74 → 30",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
    },
    {
      name: "David W.",
      age: "61",
      quote: "I've had this for 15 years. My ENT told me 'learn to live with it'. Tinni actually gave me a structure. The sound therapy is subtle, but the CBT modules changed how my brain reacts to the noise. It used to be a siren, now it's just background static. It hasn't cured it 100%, but it gave me my life back.",
      outcome: "THI dropped 52 → 14",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
    }
  ]

  return (
    <section className="py-24 md:py-32 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16 md:mb-24"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight mb-6">
            Real people. Clinical outcomes.
          </h2>
          <p className="text-lg text-muted-foreground">
            We measure success in hard numbers: specifically, the drop in Tinnitus Handicap Inventory (THI) scores.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl p-8 border border-border shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {testimonial.outcome}
                </div>
                <p className="text-foreground leading-relaxed mb-8 italic">
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>
              
              <div className="flex items-center gap-4 border-t border-border/50 pt-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                  <Image 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">Age {testimonial.age}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
