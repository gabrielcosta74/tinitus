"use client"

import { motion } from "framer-motion"

interface Option {
  value: string | number
  label: string
  sub?: string
}

interface Props {
  options: Option[]
  value?: string | number | null
  onChange: (val: string | number) => void
  columns?: 1 | 2
}

export function SingleChoice({ options, value, onChange, columns = 1 }: Props) {
  return (
    <div className={`grid gap-3 w-full ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
      {options.map((opt, i) => {
        const isSelected = value === opt.value
        return (
          <motion.button
            key={opt.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-start p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
              isSelected
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/50"
            }`}
          >
            <span className={`font-bold text-lg ${isSelected ? "text-primary" : "text-foreground"}`}>
              {opt.label}
            </span>
            {opt.sub && (
              <span className={`text-sm mt-1 font-medium ${isSelected ? "text-primary/70" : "text-foreground/50"}`}>
                {opt.sub}
              </span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
