import type { ChatMessage, ChatSession } from "@/types/coach"

const SESSION_KEY = "tinni_coach_session"

function monthKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export function loadChatSession(): ChatSession {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return { monthKey: monthKey(), messages: [], messageCount: 0 }
    const saved = JSON.parse(raw) as ChatSession
    // Reset counter if it's a new month
    if (saved.monthKey !== monthKey()) {
      return { monthKey: monthKey(), messages: saved.messages, messageCount: 0 }
    }
    return saved
  } catch {
    return { monthKey: monthKey(), messages: [], messageCount: 0 }
  }
}

export function saveChatSession(session: ChatSession): void {
  try {
    // Keep only last 100 messages to avoid hitting storage limits
    const trimmed = {
      ...session,
      messages: session.messages.slice(-100),
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(trimmed))
  } catch {}
}

export function appendMessage(msg: ChatMessage): ChatSession {
  const session = loadChatSession()
  const updated: ChatSession = {
    ...session,
    messages: [...session.messages, msg],
    messageCount: msg.role === "user" ? session.messageCount + 1 : session.messageCount,
  }
  saveChatSession(updated)
  return updated
}

export function getMonthlyUsage(): number {
  return loadChatSession().messageCount
}

export function clearChatHistory(): void {
  try {
    const session = loadChatSession()
    saveChatSession({ ...session, messages: [] })
  } catch {}
}
