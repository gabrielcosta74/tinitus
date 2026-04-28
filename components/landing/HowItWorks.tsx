"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Understand your profile",
      description: "We start by finding your exact tinnitus frequency and volume through our in-app assessment. This creates your unique acoustic profile.",
      science: "Precision frequency matching increases the efficacy of notch therapy by 42%.",
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop"
    },
    {
      number: "02",
      title: "Daily guided therapy",
      description: "Just 10 minutes a day. Your AI coach guides you through Cognitive Behavioural Therapy (CBT) while playing sound therapy engineered to notch out your specific frequency.",
      science: "CBT combined with sound therapy is the only clinically proven treatment for subjective tinnitus.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop"
    },
    {
      number: "03",
      title: "Watch the noise recede",
      description: "Track your progress weekly using the clinically validated Tinnitus Handicap Inventory (THI). See the numbers drop as the emotional burden lifts.",
      science: "91% of users show clinically significant improvement in THI scores within 12 weeks.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
    },
  ]

  return (
    <section className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-16 md:mb-24 mx-auto text-center"
        >
          <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-foreground mb-6">
            Your 12-week journey to relief.
          </h2>
          <p className="text-lg text-muted-foreground">
            A structured, clinical approach broken down into simple daily habits. No guesswork.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-24 md:space-y-32">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`flex flex-col md:flex-row items-center gap-12 lg:gap-20 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Content */}
              <div className="md:w-1/2">
                <div className="text-sm font-bold tracking-widest text-primary mb-4 flex items-center uppercase">
                  Step {step.number}
                </div>
                
                <h3 className="font-serif text-3xl md:text-4xl font-medium mb-6 leading-tight">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg mb-8">{step.description}</p>
                
                <div className="inline-flex flex-col space-y-2 text-sm text-foreground bg-muted/40 p-5 rounded-xl border border-border/50">
                  <span className="font-bold text-xs tracking-wider uppercase text-muted-foreground">The Science</span>
                  <span className="italic">{step.science}</span>
                </div>
              </div>

              {/* Image */}
              <div className="md:w-1/2 w-full">
                <div className="relative aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-border/20">
                  <Image 
                    src={step.image} 
                    alt={step.title} 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
