"use client"

import { ReactNode } from "react"
import { motion } from "framer-motion"

interface Props {
  title: string
  subtitle?: string
  children: ReactNode
}

export function QuestionLayout({ title, subtitle, children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-xl mx-auto flex flex-col min-h-[60vh] justify-center pt-8 pb-24"
    >
      <div className="mb-10 text-center sm:text-left">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-foreground/60 text-lg sm:text-xl font-medium leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      <div className="w-full">{children}</div>
    </motion.div>
  )
}
