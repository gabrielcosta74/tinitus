import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest } from "next/server"

export const runtime = "nodejs"

const FALLBACK_INSIGHTS = [
  "Your check-in data shows a pattern worth noticing: your distress tends to rise when sleep drops below 6 hours. Protecting your sleep is not just about rest — it directly dials down your tinnitus reactivity the next day. This week, treating your wind-down routine as non-negotiable will pay dividends beyond what any single session can achieve.",
  "Looking at your week, there is genuine progress here even if it does not feel dramatic yet. Consistency at this stage — showing up, logging, doing the work — is exactly what builds the neural pathways that lead to habituation. The brain changes slowly but it does change. You are already in that process.",
  "Your triggers this week point to stress as the primary amplifier. This is the most common pattern in tinnitus, and it is also the most addressable. When stress rises, the limbic system flags tinnitus as a threat, which loops back to amplify the signal. The breathing and CBT work you are doing directly interrupts that loop.",
]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { recentCheckins, profile, therapyWeek } = body as {
      recentCheckins: Array<{ loudness: number; distress: number; sleepQuality: number; stress: number; triggers: string[] }>
      profile: { duration: string; sounds: string[]; impacts: string[] } | null
      therapyWeek: number
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || recentCheckins.length === 0) {
      return new Response(FALLBACK_INSIGHTS[Math.floor(Math.random() * FALLBACK_INSIGHTS.length)], {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    }

    const avgDistress = recentCheckins.reduce((s, c) => s + c.distress, 0) / recentCheckins.length
    const avgLoudness = recentCheckins.reduce((s, c) => s + c.loudness, 0) / recentCheckins.length
    const avgSleep = recentCheckins.reduce((s, c) => s + c.sleepQuality, 0) / recentCheckins.length
    const allTriggers = recentCheckins.flatMap((c) => c.triggers)
    const triggerFreq = allTriggers.reduce<Record<string, number>>((acc, t) => {
      acc[t] = (acc[t] ?? 0) + 1
      return acc
    }, {})
    const topTriggers = Object.entries(triggerFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([t]) => t)

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `You are a clinical tinnitus specialist writing a brief weekly insight for a patient. Write 3-4 sentences (no headers, no bullets — flowing paragraph).

Patient data this week:
- Check-ins recorded: ${recentCheckins.length}
- Average distress: ${avgDistress.toFixed(1)}/10
- Average loudness: ${avgLoudness.toFixed(1)}/10
- Average sleep quality: ${avgSleep.toFixed(1)}/10
- Top triggers: ${topTriggers.length ? topTriggers.join(", ") : "none identified"}
- Therapy week: ${therapyWeek} of 12
- Tinnitus duration: ${profile?.duration ?? "unknown"}
- Primary impacts: ${profile?.impacts?.join(", ") ?? "not specified"}

Write a personalised insight that: notices something specific from their data, explains what it means clinically, and offers one actionable focus for next week. Warm but clinical. Never say "cure".`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return new Response(text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  } catch (err) {
    console.error("Insight error:", err)
    return new Response(FALLBACK_INSIGHTS[0], {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }
}
