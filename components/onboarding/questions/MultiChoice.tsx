"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface Option {
  value: string
  label: string
}

interface Props {
  options: Option[]
  values: string[]
  onChange: (values: string[]) => void
  onContinue: () => void
}

export function MultiChoice({ options, values, onChange, onContinue }: Props) {
  function toggle(val: string) {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val))
    } else {
      onChange([...values, val])
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-wrap gap-3">
        {options.map((opt, i) => {
          const isSelected = values.includes(opt.value)
          return (
            <motion.button
              key={opt.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggle(opt.value)}
              className={`px-5 py-3 rounded-full font-bold text-[15px] border-2 transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              {opt.label}
            </motion.button>
          )
        })}
      </div>

      {/* Floating Continue Button */}
      <AnimatePresence>
        {values.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-0 right-0 px-6 flex justify-center z-50 pointer-events-none"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onContinue}
              className="pointer-events-auto h-14 px-8 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center gap-3 shadow-xl shadow-primary/25 hover:bg-primary/90 transition-colors"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
