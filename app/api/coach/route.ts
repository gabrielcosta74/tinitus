import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest } from "next/server"
import type { ChatMessage } from "@/types/coach"

export const runtime = "nodejs"

// Crisis keywords that trigger the safety net
const CRISIS_PATTERNS = [
  /\b(suicid|end my life|don't want to (be here|live|go on)|no point|hopeless|can't go on|give up on life|not worth living)\b/i,
]

function isCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some((p) => p.test(text))
}

function buildSystemPrompt(ctx: UserContext): string {
  const profileSection = ctx.profile
    ? `PATIENT PROFILE:
- Tinnitus duration: ${ctx.profile.duration}
- Sound character: ${ctx.profile.sounds?.join(", ") ?? "not specified"}
- Primary impacts: ${ctx.profile.impacts?.join(", ") ?? "not specified"}
- Hearing loss: ${ctx.profile.hearingLoss ?? "unknown"}
- Stress level at assessment: ${ctx.profile.stressLevel ?? "unknown"}/5`
    : "PATIENT PROFILE: Not yet completed."

  const thiSection =
    ctx.thiScore !== null
      ? `THI SCORE: ${ctx.thiScore}/100 (${ctx.severity})`
      : "THI SCORE: Not yet assessed."

  const frequencySection =
    ctx.frequencyHz !== null
      ? `MATCHED TINNITUS FREQUENCY: ${ctx.frequencyHz} Hz`
      : "MATCHED FREQUENCY: Not yet measured."

  const checkinSection =
    ctx.recentCheckins.length > 0
      ? `RECENT CHECK-INS (last ${ctx.recentCheckins.length} days):
${ctx.recentCheckins
  .map(
    (c) =>
      `  • ${c.date}: loudness ${c.loudness}/10, distress ${c.distress}/10, sleep ${c.sleepQuality}/10, stress ${c.stress}/10${c.triggers?.length ? `, triggers: ${c.triggers.join(", ")}` : ""}`
  )
  .join("\n")}`
      : "RECENT CHECK-INS: None recorded yet."

  const weekSection = `THERAPY WEEK: ${ctx.therapyWeek} of 12`

  return `You are Tinni — an AI tinnitus coach trained in Cognitive Behavioural Therapy (CBT) and Acceptance and Commitment Therapy (ACT). You work within a clinically informed digital therapeutic programme.

${profileSection}

${thiSection}
${frequencySection}

${checkinSection}

${weekSection}

YOUR ROLE AND APPROACH:
1. VALIDATE FIRST — always acknowledge feelings before educating or advising. Never jump straight to advice.
2. You are warm, calm, and precise — like a brilliant specialist who genuinely cares.
3. Use the patient's specific data (their THI score, frequency, recent logs, triggers) to make responses feel personally relevant.
4. For distress > 7 in recent logs: be gentler, shorter messages, more grounding focus.
5. Guide CBT exercises conversationally — don't just describe them, walk through them step by step.
6. For breathing exercises: write "Breathe in for 4 counts... hold for 7... breathe out for 8..." as interactive prompts.
7. For cognitive restructuring: ask "What thought is most upsetting right now?" then guide through challenge → reframe.
8. For tinnitus spikes: acknowledge → breathing → grounding (5-4-3-2-1 senses) → perspective.
9. NEVER say "cure tinnitus" — always "reduce distress", "improve quality of life", "build tolerance", "habituate".
10. NEVER diagnose or suggest medical changes. Always recommend audiologist for clinical questions.
11. Keep responses focused and appropriately brief — this is a chat, not a lecture. 2–4 short paragraphs maximum.
12. Use line breaks between paragraphs for readability.
13. If the user asks to review their progress, reference their actual check-in data above.

CRISIS PROTOCOL: If someone expresses hopelessness about life (not just tinnitus frustration), respond with warmth, acknowledge their pain, and gently offer: "If you're having thoughts of harming yourself, please reach out — you can call or text a crisis line (UK: 116 123 Samaritans, US: 988 Suicide & Crisis Lifeline). You don't have to carry this alone."`
}

interface UserContext {
  profile: {
    duration?: string
    sounds?: string[]
    impacts?: string[]
    hearingLoss?: string
    stressLevel?: number
  } | null
  thiScore: number | null
  severity: string | null
  frequencyHz: number | null
  recentCheckins: Array<{
    date: string
    loudness: number
    distress: number
    sleepQuality: number
    stress: number
    triggers?: string[]
  }>
  therapyWeek: number
}

interface CoachRequest {
  messages: ChatMessage[]
  userContext: UserContext
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CoachRequest
    const { messages, userContext } = body

    const lastUserMessage = messages.filter((m) => m.role === "user").at(-1)?.content ?? ""

    // Crisis check — inject safety message into stream immediately
    if (isCrisis(lastUserMessage)) {
      const crisisResponse = `I can hear that you're in a really dark place right now, and I want you to know that what you're feeling matters deeply.

Tinnitus distress can become genuinely overwhelming — and sometimes it touches something much deeper than just the sound. You don't have to minimise that.

If you're having thoughts of harming yourself or not wanting to be here, please reach out to someone who can really be with you right now:
• **UK:** Samaritans — 116 123 (free, 24/7)
• **US:** 988 Suicide & Crisis Lifeline — call or text 988
• **International:** findahelpline.com

I'm still here with you. Once you've had a chance to reach out or feel a little steadier, I'd like to help you with what's making today so hard.`

      const encoder = new TextEncoder()
      return new Response(encoder.encode(crisisResponse), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      const fallback = `I'm here with you. I notice you've been working through some real challenges with your tinnitus.

Before I respond fully, I want to make sure my guidance is grounded in what's actually happening for you. Could you tell me a bit more about what's going on right now — is this about a specific moment, a pattern you've noticed, or something you'd like to work through together?`
      const encoder = new TextEncoder()
      return new Response(encoder.encode(fallback), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const systemPrompt = buildSystemPrompt(userContext)

    // Build Gemini history (exclude the last user message — that's the current turn)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }))

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        {
          role: "model",
          parts: [
            {
              text: "Understood. I'm Tinni, ready to support this patient with their tinnitus journey using their specific profile and history.",
            },
          ],
        },
        ...history,
      ],
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 600,
      },
    })

    const result = await chat.sendMessageStream(lastUserMessage)

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) controller.enqueue(encoder.encode(text))
          }
        } catch (e) {
          console.error("Stream error:", e)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  } catch (err) {
    console.error("Coach API error:", err)
    const encoder = new TextEncoder()
    const fallback =
      "I'm here with you. Something interrupted my response — could you try sending that again? I want to make sure I give you my full attention."
    return new Response(encoder.encode(fallback), {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }
}
