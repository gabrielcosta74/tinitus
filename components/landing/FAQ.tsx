"use client"

import { motion } from "framer-motion"
import { Accordion } from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "Is this a cure for tinnitus?",
      answer: "Currently, there is no scientifically proven 'cure' that completely eliminates the physiological source of tinnitus. However, Tinni uses clinically validated methods (CBT and notch therapy) to train your brain to habituate to the sound. For 91% of our users, this results in the sound becoming significantly less noticeable and distress dropping dramatically."
    },
    {
      question: "How is 'notch therapy' different from white noise?",
      answer: "White noise simply masks the ringing by drowning it out with a louder sound. Notch therapy is different. We test your specific tinnitus frequency and create a sound profile that 'notches out' (removes) that exact frequency. Listening to this actively trains your auditory cortex to ignore the ringing."
    },
    {
      question: "Will the AI Coach actually understand my specific case?",
      answer: "Yes. During onboarding, the AI builds a clinical profile of your tinnitus (pitch, volume, triggers, sleep impact). It uses this context to provide targeted CBT exercises and in-the-moment grounding techniques when you experience a spike."
    },
    {
      question: "How long does it take to see results?",
      answer: "Our clinical data shows most users begin to see a measurable drop in their Tinnitus Handicap Inventory (THI) score within 3 to 4 weeks. The full clinical programme is designed for 12 weeks to achieve long-term habituation."
    },
    {
      question: "Can I use this alongside my doctor's treatment?",
      answer: "Absolutely. Tinni is designed to complement clinical care. You can export your progress, THI scores, and therapy adherence as a PDF to share with your audiologist or ENT specialist."
    },
    {
      question: "I have hearing loss as well. Will this still work?",
      answer: "Yes. Many people with tinnitus also have some degree of hearing loss. Our frequency matching tool accounts for your hearing threshold, and the CBT modules are effective regardless of hearing capability."
    },
    {
      question: "Do I need special headphones?",
      answer: "No special equipment is required. Any standard pair of headphones or earbuds will work for the sound therapy, though we recommend over-ear headphones for the most immersive and comfortable experience, especially during the sleep programme."
    },
    {
      question: "What happens if it doesn't work for me?",
      answer: "We offer a 30-day money-back guarantee. If you complete the assessments, engage with the therapy, and your THI score doesn't show improvement, we will refund your subscription completely."
    }
  ]

  return (
    <section className="py-24 md:py-32 bg-background border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight mb-6">
              Common questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Clear, honest answers about the science and the process.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Accordion items={faqs} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
