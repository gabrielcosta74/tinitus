"use client"

import { motion } from "framer-motion"
import type { ChatMessage } from "@/types/coach"

interface ChatBubbleProps {
  message: ChatMessage
  isStreaming?: boolean
}

// Render newlines and bold (**text**) from Gemini markdown
function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\n)/)
  return parts.map((part, i) => {
    if (part === "\n") return <br key={i} />
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

export function ChatBubble({ message, isStreaming = false }: ChatBubbleProps) {
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center flex-shrink-0 mb-0.5">
          <span className="text-[10px] font-bold text-teal-400">T</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[82%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-teal-600/80 text-white rounded-br-sm"
            : "bg-[#14141F] border border-white/8 text-white/85 rounded-bl-sm"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">
          {renderContent(message.content)}
          {isStreaming && (
            <span className="inline-block w-0.5 h-3.5 bg-teal-400 animate-pulse ml-0.5 align-middle" />
          )}
        </p>
        <p className={`text-[10px] mt-1.5 ${isUser ? "text-white/40 text-right" : "text-white/25"}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </motion.div>
  )
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex items-end gap-2.5"
    >
      <div className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
        <span className="text-[10px] font-bold text-teal-400">T</span>
      </div>
      <div className="bg-[#14141F] border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-teal-400/60"
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
