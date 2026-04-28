export type MessageRole = "user" | "assistant"

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string // ISO
}

export interface ChatSession {
  monthKey: string // YYYY-MM
  messages: ChatMessage[]
  messageCount: number // messages sent this month (user only)
}

export const FREE_TIER_LIMIT = 20
