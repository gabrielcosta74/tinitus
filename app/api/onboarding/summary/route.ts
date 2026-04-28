import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest } from "next/server"

export const runtime = "nodejs"

const FALLBACKS: Record<string, string> = {
  Slight:
    "Your assessment indicates slight tinnitus impact — many people at this stage respond exceptionally well to structured therapy. Our programme combines evidence-based CBT with sound therapy personalised to your exact tinnitus frequency, helping your brain learn to deprioritise the signal over time. Research shows that targeted habituation therapy can reduce perceived loudness and distress significantly, even when the tinnitus itself has been present for years. You are starting this journey at a good point, and the evidence is firmly on your side.",
  Mild: "Your assessment reflects mild but real tinnitus distress — the kind that quietly erodes sleep quality and concentration even when you appear fine to others. Our 12-week programme uses clinically validated CBT techniques paired with notch-filtered sound therapy calibrated to your specific frequency, which research shows accelerates habituation. Addressing tinnitus at this stage, before distress patterns become deeply ingrained, gives you the strongest possible foundation for lasting improvement. You have taken the most important step by choosing to act now.",
  Moderate:
    "Your results show tinnitus is meaningfully affecting your quality of life — this is an honest and common picture for people who have been managing this condition for some time without targeted support. Our programme combines the same CBT framework used in clinical audiology practice with personalised sound therapy and daily AI coaching, all specifically designed to interrupt the distress cycle that drives moderate tinnitus suffering. Clinical trials of this combined approach show that most people at your level achieve a significant and measurable reduction in distress within 8 to 12 weeks. Relief is genuinely within reach.",
  Severe:
    "Your assessment places you in the severe range — this reflects the very real burden you have been carrying, and it deserves to be taken seriously rather than managed with generic solutions. Our programme was built precisely for people at your level: combining structured CBT with personalised notch therapy and an AI coach that adapts daily to how you are feeling, it addresses both the neurological and psychological dimensions of severe tinnitus distress. The evidence shows that even long-standing, severe tinnitus responds to this kind of comprehensive, consistent approach. You do not have to keep enduring this at the same intensity.",
  Catastrophic:
    "Your results reflect profound tinnitus suffering, and we want you to know: what you are experiencing is real, recognised, and — crucially — treatable. Our programme combines intensive CBT, personalised sound therapy, and daily AI support specifically designed for people whose tinnitus has become all-consuming. The clinical evidence is clear that even catastrophic-level tinnitus distress can be substantially reduced through the systematic habituation and cognitive work our programme delivers. You deserve comprehensive, science-backed support, and that is exactly what begins here.",
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { profile, thiScore, severity, frequencyHz } = body as {
      profile: { duration: string; sounds: string[]; impacts: string[]; hearingLoss: string; stressLevel: number }
      thiScore: number
      severity: string
      frequencyHz: number
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return new Response(FALLBACKS[severity] ?? FALLBACKS.Moderate, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const systemPrompt = `You are a clinical audiologist and tinnitus specialist writing a brief, personalised assessment summary for a patient.
Your tone is: warm, clinical, confident, and empathetic — like a brilliant specialist who takes this seriously.
Rules:
- Write exactly 3-4 sentences, no more
- Never use the word "cure" — use "reduce", "manage", "improve", "relieve", "habituation"
- Reference their specific situation (severity tier, frequency, impacts)
- End with a hopeful, evidence-based statement
- Do not use bullet points or headers — flowing paragraph only
- Do not start with "I" or "We" — start with a reference to their situation`

    const userPrompt = `Patient profile:
- Tinnitus duration: ${profile.duration}
- Sound character: ${profile.sounds.join(", ")}
- Primary impacts: ${profile.impacts.join(", ")}
- Hearing loss: ${profile.hearingLoss}
- Stress level: ${profile.stressLevel}/5
- THI Score: ${thiScore}/100 (${severity} severity)
- Matched frequency: ${frequencyHz} Hz

Write their personalised clinical assessment summary (3-4 sentences).`

    const result = await model.generateContentStream([
      { text: systemPrompt + "\n\n" + userPrompt },
    ])

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) controller.enqueue(encoder.encode(text))
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  } catch (err) {
    console.error("Gemini summary error:", err)
    return new Response(FALLBACKS.Moderate, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  }
}
