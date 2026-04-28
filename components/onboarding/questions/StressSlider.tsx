"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface Props {
  value: number
  onChange: (val: number) => void
  onContinue: () => void
}

export function StressSlider({ value, onChange, onContinue }: Props) {
  return (
    <div className="flex flex-col gap-12 w-full max-w-md mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-bold uppercase tracking-widest text-foreground/40">Low Stress</span>
          <span className="text-4xl font-bold tabular-nums text-primary">{value}</span>
          <span className="text-sm font-bold uppercase tracking-widest text-foreground/40">High Stress</span>
        </div>

        <div className="relative pt-4 pb-8 px-2">
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-4 appearance-none rounded-full cursor-pointer bg-muted outline-none"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) ${((value - 1) / 4) * 100}%, hsl(var(--muted)) ${((value - 1) / 4) * 100}%)`,
            }}
          />
          
          {/* Custom thumb style overrides in global.css normally, but we use a thick slider */}
          
          <div className="flex justify-between mt-4 px-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={`text-sm font-bold w-6 text-center ${
                  value >= n ? "text-primary" : "text-foreground/30"
                }`}
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onContinue}
        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
      >
        Continue <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  )
}
