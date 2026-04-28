"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Trash2, Lock, ArrowUpRight } from "lucide-react"
import { ChatBubble, TypingIndicator } from "@/components/coach/ChatBubble"
import { PromptChips } from "@/components/coach/PromptChips"
import {
  loadChatSession,
  appendMessage,
  getMonthlyUsage,
  clearChatHistory,
} from "@/lib/coach-storage"
import { loadOnboardingState } from "@/lib/onboarding-storage"
import { loadRecentCheckins, getTherapyWeek } from "@/lib/dashboard-storage"
import { getSeverity } from "@/lib/thi"
import type { ChatMessage } from "@/types/coach"
import { FREE_TIER_LIMIT } from "@/types/coach"

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

// Build the user context object sent to the API
function buildUserContext() {
  try {
    const onboarding = loadOnboardingState()
    const recentCheckins = loadRecentCheckins(7)
    const therapyWeek = getTherapyWeek()

    return {
      profile: onboarding.profile ?? null,
      thiScore: onboarding.thiScore ?? null,
      severity: onboarding.thiScore != null ? getSeverity(onboarding.thiScore).label : null,
      frequencyHz: onboarding.frequencyHz ?? null,
      recentCheckins: recentCheckins.map((c) => ({
        date: c.date,
        loudness: c.loudness,
        distress: c.distress,
        sleepQuality: c.sleepQuality,
        stress: c.stress,
        triggers: c.triggers,
      })),
      therapyWeek,
    }
  } catch {
    return {
      profile: null,
      thiScore: null,
      severity: null,
      frequencyHz: null,
      recentCheckins: [],
      therapyWeek: 1,
    }
  }
}

// Welcome message shown on first load
const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello. I'm Tinni — your tinnitus coach.\n\nI know your profile, your assessment results, and how you've been doing recently. Everything we talk about is private and stays on your device.\n\nHow are you feeling today? Or choose a topic below to get started.",
  timestamp: new Date().toISOString(),
}

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [monthlyUsage, setMonthlyUsage] = useState(0)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [streamingId, setStreamingId] = useState<string | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const isAtLimit = monthlyUsage >= FREE_TIER_LIMIT

  // Load history and usage on mount
  useEffect(() => {
    const session = loadChatSession()
    setMessages(session.messages.length > 0 ? session.messages : [WELCOME])
    setMonthlyUsage(getMonthlyUsage())
    setHydrated(true)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isStreaming])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isStreaming || isAtLimit) return

      // Append user message
      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
      }

      const historyWithUser = appendMessage(userMsg)
      setMessages(historyWithUser.messages)
      setMonthlyUsage(historyWithUser.messageCount)
      setInput("")

      // Prepare assistant message placeholder
      const assistantId = generateId()
      setStreamingId(assistantId)
      setIsStreaming(true)

      // Add empty assistant message that will be filled by stream
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: new Date().toISOString() },
      ])

      const userContext = buildUserContext()
      const apiMessages = historyWithUser.messages.filter((m) => m.id !== "welcome")

      try {
        abortRef.current = new AbortController()
        const res = await fetch("/api/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages, userContext }),
          signal: AbortSignal.timeout(30_000),
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const reader = res.body?.getReader()
        if (!reader) throw new Error("No stream reader")

        const decoder = new TextDecoder()
        let accumulated = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })

          // Update the streaming message in real-time
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: accumulated } : m
            )
          )
        }

        // Persist completed assistant message
        const finalMsg: ChatMessage = {
          id: assistantId,
          role: "assistant",
          content: accumulated,
          timestamp: new Date().toISOString(),
        }
        appendMessage(finalMsg)
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? finalMsg : m)))
      } catch (err) {
        console.error("Coach stream error:", err)
        const errMsg: ChatMessage = {
          id: assistantId,
          role: "assistant",
          content:
            "Something interrupted my response. Please try sending again — I'm still here.",
          timestamp: new Date().toISOString(),
        }
        appendMessage(errMsg)
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? errMsg : m)))
      } finally {
        setIsStreaming(false)
        setStreamingId(null)
      }
    },
    [isStreaming, isAtLimit]
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  function handleClear() {
    clearChatHistory()
    setMessages([WELCOME])
    setShowClearConfirm(false)
  }

  const showChips =
    hydrated &&
    messages.filter((m) => m.role === "user").length === 0

  const usagePct = Math.min(1, monthlyUsage / FREE_TIER_LIMIT)

  if (!hydrated) {
    return (
      <div className="h-screen bg-[#080810] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#080810] flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-white/[0.06] px-4 py-3.5 flex items-center justify-between bg-[#080810]/95 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
            <span className="text-sm font-bold text-teal-400">T</span>
          </div>
          <div>
            <div className="font-serif font-medium text-white text-sm">Tinni Coach</div>
            <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Online · Knows your profile
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Monthly usage */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/8">
            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  usagePct >= 1 ? "bg-red-500" : usagePct > 0.7 ? "bg-amber-500" : "bg-teal-500"
                }`}
                style={{ width: `${usagePct * 100}%` }}
              />
            </div>
            <span className={`text-[10px] font-semibold ${isAtLimit ? "text-red-400" : "text-white/35"}`}>
              {monthlyUsage}/{FREE_TIER_LIMIT}
            </span>
          </div>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="p-2 rounded-xl text-white/25 hover:text-white/60 hover:bg-white/8 transition-all"
            title="Clear chat history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isStreaming={isStreaming && msg.id === streamingId}
          />
        ))}

        <AnimatePresence>
          {isStreaming && streamingId && messages.find((m) => m.id === streamingId)?.content === "" && (
            <TypingIndicator />
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Prompt chips (shown before first user message) */}
      <AnimatePresence>
        {showChips && !isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <PromptChips onSelect={(chip) => sendMessage(chip)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paywall banner */}
      <AnimatePresence>
        {isAtLimit && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mb-2 p-3.5 rounded-2xl bg-amber-500/8 border border-amber-500/20 flex items-center gap-3"
          >
            <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-300">20 messages used this month</p>
              <p className="text-xs text-amber-400/70 mt-0.5">
                Upgrade to Pro for unlimited coaching conversations
              </p>
            </div>
            <a
              href="/settings"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/30 transition-all flex-shrink-0"
            >
              Upgrade <ArrowUpRight className="w-3 h-3" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-white/[0.05]">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              // Auto-grow
              e.target.style.height = "auto"
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
            }}
            onKeyDown={handleKeyDown}
            disabled={isStreaming || isAtLimit}
            placeholder={
              isAtLimit
                ? "Upgrade to Pro to continue coaching…"
                : "Type a message… (Enter to send)"
            }
            rows={1}
            className="flex-1 resize-none bg-[#13131D] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden"
            style={{ maxHeight: 120 }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming || isAtLimit}
            className="w-11 h-11 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg shadow-teal-900/30 flex-shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>

        {/* Mobile usage counter */}
        <div className="sm:hidden flex items-center justify-center mt-2 gap-1">
          <div className="w-24 h-0.5 bg-white/8 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                usagePct >= 1 ? "bg-red-500" : usagePct > 0.7 ? "bg-amber-500" : "bg-teal-500"
              }`}
              style={{ width: `${usagePct * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-white/20">{monthlyUsage}/{FREE_TIER_LIMIT} this month</span>
        </div>
      </div>

      {/* Clear confirm modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#14141F] border border-white/12 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h3 className="font-serif text-lg font-medium text-white mb-2">Clear chat history?</h3>
              <p className="text-sm text-white/50 mb-5">
                This removes all messages from your device. Your check-in data and assessment results are kept.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/12 text-sm text-white/60 hover:bg-white/8 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClear}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-sm text-red-400 hover:bg-red-500/30 transition-all font-semibold"
                >
                  Clear history
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
