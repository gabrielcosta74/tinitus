import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest } from "next/server"
import type { SessionPlan } from "@/types/dashboard"

export const runtime = "nodejs"

function fallbackPlan(distress: number, therapyWeek: number): SessionPlan {
  const week = Math.max(1, Math.min(12, therapyWeek))
  const moduleMap: Record<number, { module: string; moduleDescription: string }> = {
    1: { module: "Psychoeducation", moduleDescription: "Understanding how your brain creates and sustains tinnitus — the foundation of habituation." },
    2: { module: "Thought Awareness", moduleDescription: "Learning to notice tinnitus-related thoughts without being pulled into them." },
    3: { module: "Breathing Exercises", moduleDescription: "The 4-7-8 breathing technique to calm your nervous system's response to tinnitus." },
    4: { module: "Breathing & Anchoring", moduleDescription: "Combining breath work with grounding techniques to reduce acute distress spikes." },
    5: { module: "Cognitive Restructuring", moduleDescription: "Identifying unhelpful thoughts about tinnitus and building more balanced alternatives." },
    6: { module: "Challenging Core Beliefs", moduleDescription: "Working with deeper beliefs that amplify tinnitus suffering." },
    7: { module: "Attention Training", moduleDescription: "Learning to direct attention deliberately, reducing the brain's focus on tinnitus." },
    8: { module: "Grounding & Presence", moduleDescription: "Sensory grounding exercises to anchor you in the present and away from tinnitus." },
    9: { module: "Acceptance (ACT)", moduleDescription: "Accepting tinnitus as a sensation rather than fighting it — a key shift in habituation." },
    10: { module: "Values & Committed Action", moduleDescription: "Reconnecting with what matters to you despite tinnitus, reducing avoidance." },
    11: { module: "Maintenance Planning", moduleDescription: "Building your personal toolkit for managing tinnitus long-term." },
    12: { module: "Relapse Prevention", moduleDescription: "Creating your personalised action plan for difficult periods." },
  }
  const weekData = moduleMap[week] ?? moduleMap[1]

  if (distress >= 7) {
    return {
      duration: 20,
      soundDuration: 12,
      tone: "Soft pink noise with gentle ocean",
      approach: "Compassionate and slow-paced. No pressure today.",
      affirmation: "You showed up. That is enough for today.",
      therapyWeek: week,
      ...weekData,
    }
  }
  if (distress >= 4) {
    return {
      duration: 30,
      soundDuration: 10,
      tone: "Brown noise with notch filter",
      approach: "Steady and supportive. Good balance of education and practice.",
      affirmation: "Consistency is what builds habituation — and you are building it.",
      therapyWeek: week,
      ...weekData,
    }
  }
  return {
    duration: 40,
    soundDuration: 8,
    tone: "Light white noise",
    approach: "Active and engaged. A good day to do the deeper work.",
    affirmation: "Every good day is an investment in your resilience.",
    therapyWeek: week,
    ...weekData,
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { checkin, therapyWeek = 1 } = body as {
      checkin: { loudness: number; distress: number; sleepQuality: number; stress: number; triggers: string[] }
      therapyWeek: number
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return Response.json(fallbackPlan(checkin.distress, therapyWeek))
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    })

    const weekModules: Record<number, string> = {
      1: "Psychoeducation", 2: "Thought Awareness", 3: "Breathing Exercises",
      4: "Breathing & Anchoring", 5: "Cognitive Restructuring", 6: "Challenging Core Beliefs",
      7: "Attention Training", 8: "Grounding & Presence", 9: "Acceptance (ACT)",
      10: "Values & Committed Action", 11: "Maintenance Planning", 12: "Relapse Prevention",
    }
    const currentModule = weekModules[Math.min(12, Math.max(1, therapyWeek))] ?? "Psychoeducation"

    const prompt = `You are a clinical tinnitus therapist. Generate a therapy session plan as JSON.

Patient check-in today:
- Tinnitus loudness: ${checkin.loudness}/10
- Emotional distress: ${checkin.distress}/10
- Sleep quality last night: ${checkin.sleepQuality}/10
- Current stress: ${checkin.stress}/10
- Triggers: ${checkin.triggers.length ? checkin.triggers.join(", ") : "None identified"}
- Therapy programme week: ${therapyWeek} of 12
- This week's module: ${currentModule}

Rules:
- distress >= 7: duration 18-22 min, soundDuration 12-14 min, gentle approach
- distress 4-6: duration 28-32 min, soundDuration 9-11 min, steady approach
- distress <= 3: duration 38-42 min, soundDuration 7-9 min, active approach

Return exactly this JSON (no markdown, just the object):
{
  "duration": <integer, total minutes>,
  "module": "${currentModule}",
  "moduleDescription": "<one clear sentence about what this module covers>",
  "soundDuration": <integer, sound therapy minutes>,
  "tone": "<specific sound recommendation e.g. 'Warm pink noise with distant rain'>",
  "approach": "<therapist note about today's tone/pace, 1 sentence>",
  "affirmation": "<one warm, non-cliche encouragement for this specific person today>",
  "therapyWeek": ${therapyWeek}
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    try {
      const plan = JSON.parse(text) as SessionPlan
      return Response.json(plan)
    } catch {
      return Response.json(fallbackPlan(checkin.distress, therapyWeek))
    }
  } catch (err) {
    console.error("Session plan error:", err)
    return Response.json(fallbackPlan(5, 1))
  }
}
