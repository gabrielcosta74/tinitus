import type { Exercise, SessionLog } from "@/types/session"
import { todayKey } from "./dashboard-storage"

// --- Session log persistence ---
export function saveSessionLog(log: SessionLog): void {
  try {
    const existing = loadAllSessionLogs()
    existing.unshift(log)
    localStorage.setItem("tinni_session_logs", JSON.stringify(existing.slice(0, 90))) // keep 90 days
  } catch {}
}

export function loadAllSessionLogs(): SessionLog[] {
  try {
    const raw = localStorage.getItem("tinni_session_logs")
    return raw ? (JSON.parse(raw) as SessionLog[]) : []
  } catch {
    return []
  }
}

export function loadTodaySessionLog(): SessionLog | null {
  const today = todayKey()
  const logs = loadAllSessionLogs()
  return logs.find((l) => l.date === today) ?? null
}

// --- Exercise library by module (week 1-12) ---
export function getExercisesForModule(module: string, therapyWeek: number): Exercise[] {
  const base = BASE_EXERCISES[module] ?? BASE_EXERCISES["Psychoeducation"]
  return base
}

// --- Completed sessions count ---
export function getTotalSessionsCount(): number {
  return loadAllSessionLogs().length
}

// ─── Exercise definitions by module ─────────────────────────────────────────

const BASE_EXERCISES: Record<string, Exercise[]> = {
  Psychoeducation: [
    {
      id: "psych-intro",
      type: "psychoeducation",
      title: "Understanding Tinnitus",
      durationSeconds: 240,
      content: {
        kind: "psychoeducation",
        slides: [
          {
            heading: "What is actually happening?",
            body: "Tinnitus is not a sound — it is a perception. Your auditory cortex is generating a signal your ears never sent. This happens when the brain compensates for reduced input from damaged hair cells by turning up its own gain.",
          },
          {
            heading: "Why does it feel so loud?",
            body: "The limbic system — your brain's threat-detection network — has tagged the tinnitus signal as dangerous. This increases attention to it and amplifies emotional distress. It is a learned response, not a fixed one.",
          },
          {
            heading: "What is habituation?",
            body: "Habituation is when the brain reclassifies tinnitus from 'threat' to 'irrelevant background noise'. Like a fan in a room, you stop noticing it. CBT directly accelerates this reclassification process.",
          },
          {
            heading: "Your 12-week journey",
            body: "Each session builds on the last. Week 1 is about understanding. By week 6, you will have real tools for acute distress. By week 12, you will have a personalised plan for life. The science is clear — consistent practice works.",
          },
        ],
      },
    },
    {
      id: "psych-breathing-intro",
      type: "breathing",
      title: "4-7-8 Breathing",
      durationSeconds: 180,
      content: {
        kind: "breathing",
        pattern: { inhale: 4, hold: 7, exhale: 8 },
        cycles: 4,
        instruction: "This pattern activates your parasympathetic nervous system, reducing the stress response that amplifies tinnitus. Follow the circle.",
      },
    },
    {
      id: "psych-sound",
      type: "sound-therapy",
      title: "Pink Noise Exposure",
      durationSeconds: 600,
      content: {
        kind: "sound-therapy",
        noiseType: "pink",
        durationSeconds: 600,
        instruction: "Sit comfortably. Let the sound fill the room without trying to mask your tinnitus. We are teaching your brain that sound is safe — a first step toward habituation.",
      },
    },
    {
      id: "psych-reflection",
      type: "reflection",
      title: "Session Reflection",
      durationSeconds: 120,
      content: {
        kind: "reflection",
        prompt: "What was the most surprising thing you learned about your tinnitus today?",
        followUp: "How might understanding this change the way you relate to the sound?",
      },
    },
  ],

  "Thought Awareness": [
    {
      id: "ta-intro",
      type: "psychoeducation",
      title: "Thoughts About Tinnitus",
      durationSeconds: 180,
      content: {
        kind: "psychoeducation",
        slides: [
          {
            heading: "The thought-distress loop",
            body: "When tinnitus is noticed, automatic thoughts fire instantly: 'This is unbearable', 'It will never stop', 'I can't cope'. These thoughts are not facts — they are the brain in threat-mode. Noticing them is the first step to loosening their grip.",
          },
          {
            heading: "Thoughts are not reality",
            body: "A thought like 'the tinnitus is destroying my life' is an event in your mind, not a statement of fact. The same tinnitus loudness can feel catastrophic on a bad day and manageable on a good one. The sound hasn't changed — only the thought about it has.",
          },
          {
            heading: "The observer perspective",
            body: "Today's practice is simple: notice when a thought about your tinnitus appears, name it ('there is a thought that...'), and let it pass without engaging. You don't need to fix it. Just see it.",
          },
        ],
      },
    },
    {
      id: "ta-breathing",
      type: "breathing",
      title: "Box Breathing",
      durationSeconds: 180,
      content: {
        kind: "breathing",
        pattern: { inhale: 4, hold: 4, exhale: 4, holdOut: 4 },
        cycles: 5,
        instruction: "Box breathing creates a rhythmic, predictable pattern that breaks the cycle of anxious thought. Used by Navy SEALs to calm under pressure.",
      },
    },
    {
      id: "ta-attention",
      type: "attention-training",
      title: "Defusion Practice",
      durationSeconds: 300,
      content: {
        kind: "attention-training",
        instruction: "For the next few minutes, notice sounds in your environment one at a time. Shift your attention deliberately between each anchor. This is attention training — building your ability to choose where focus goes.",
        anchors: [
          "The sound furthest away from you",
          "A sound inside the room",
          "The sensation of your feet on the floor",
          "The feeling of air entering your nostrils",
          "A sound outside — notice it without labelling it",
        ],
      },
    },
    {
      id: "ta-sound",
      type: "sound-therapy",
      title: "Brown Noise",
      durationSeconds: 480,
      content: {
        kind: "sound-therapy",
        noiseType: "brown",
        durationSeconds: 480,
        instruction: "Let the brown noise be a soft backdrop. Practice noticing your tinnitus without immediately reacting to it. See if you can observe it as just another sound.",
      },
    },
    {
      id: "ta-reflection",
      type: "reflection",
      title: "Session Reflection",
      durationSeconds: 120,
      content: {
        kind: "reflection",
        prompt: "What thoughts did you notice about your tinnitus during today's session?",
        followUp: "Can you identify one thought that felt most true but might not actually be a fact?",
      },
    },
  ],

  "Breathing Exercises": [
    {
      id: "be-intro",
      type: "psychoeducation",
      title: "Breath and the Nervous System",
      durationSeconds: 150,
      content: {
        kind: "psychoeducation",
        slides: [
          {
            heading: "Why breath changes everything",
            body: "Slow, controlled breathing directly activates the vagus nerve — the main trunk of your parasympathetic system. Within 90 seconds, cortisol drops, the amygdala calms, and tinnitus distress follows. This is physiology, not relaxation fluff.",
          },
          {
            heading: "Today's session",
            body: "Three different breathing patterns, each targeting a different state. Practice all three — you will find which works best for you in moments of acute distress.",
          },
        ],
      },
    },
    {
      id: "be-478",
      type: "breathing",
      title: "4-7-8 Technique",
      durationSeconds: 200,
      content: {
        kind: "breathing",
        pattern: { inhale: 4, hold: 7, exhale: 8 },
        cycles: 5,
        instruction: "The extended exhale is key — it signals safety to the nervous system. Keep the exhale slow and controlled through pursed lips.",
      },
    },
    {
      id: "be-box",
      type: "breathing",
      title: "Box Breathing",
      durationSeconds: 160,
      content: {
        kind: "breathing",
        pattern: { inhale: 4, hold: 4, exhale: 4, holdOut: 4 },
        cycles: 5,
        instruction: "Equal counts in all four phases creates a steady rhythm. Use this in the moment when tinnitus spikes suddenly.",
      },
    },
    {
      id: "be-coherent",
      type: "breathing",
      title: "Coherent Breathing (5-5)",
      durationSeconds: 180,
      content: {
        kind: "breathing",
        pattern: { inhale: 5, hold: 0, exhale: 5 },
        cycles: 8,
        instruction: "5 seconds in, 5 seconds out — no holds. At exactly 6 breaths per minute, heart rate variability peaks. This is optimal nervous system regulation.",
      },
    },
    {
      id: "be-sound",
      type: "sound-therapy",
      title: "Pink Noise Relaxation",
      durationSeconds: 420,
      content: {
        kind: "sound-therapy",
        noiseType: "pink",
        durationSeconds: 420,
        instruction: "Continue breathing slowly as you rest with the pink noise. Let any thoughts come and go without engaging.",
      },
    },
    {
      id: "be-reflection",
      type: "reflection",
      title: "Session Reflection",
      durationSeconds: 90,
      content: {
        kind: "reflection",
        prompt: "Which breathing pattern felt most effective for you today?",
        followUp: "When during the day could you use this when tinnitus distress rises?",
      },
    },
  ],

  "Cognitive Restructuring": [
    {
      id: "cr-intro",
      type: "psychoeducation",
      title: "Changing How You Think",
      durationSeconds: 180,
      content: {
        kind: "psychoeducation",
        slides: [
          {
            heading: "Cognitive distortions and tinnitus",
            body: "The brain in tinnitus distress tends toward catastrophising ('It will never get better'), all-or-nothing thinking ('I can't enjoy anything with this'), and mind-reading ('People don't understand me'). These patterns are very common and very treatable.",
          },
          {
            heading: "The ABC model",
            body: "A (activating event) → B (belief/thought) → C (consequence/feeling). The sound is A. Your thought about it is B. Your distress is C. CBT targets B — the one part you can actually change.",
          },
        ],
      },
    },
    {
      id: "cr-restructure",
      type: "cognitive-restructuring",
      title: "Thought Reframing",
      durationSeconds: 300,
      content: {
        kind: "cognitive-restructuring",
        thought: "My tinnitus is ruining my life and I'll never be happy again.",
        challenge: "Is it really true that there has been no moment of happiness, connection, or meaning since tinnitus began? What evidence contradicts this thought?",
        reframe: "Tinnitus is creating real difficulty in my life right now. And I am still capable of meaningful experiences, connection, and moments of peace.",
        affirmation: "I can hold both the difficulty and the possibility at the same time.",
      },
    },
    {
      id: "cr-breathing",
      type: "breathing",
      title: "Grounding Breath",
      durationSeconds: 160,
      content: {
        kind: "breathing",
        pattern: { inhale: 4, hold: 4, exhale: 6 },
        cycles: 5,
        instruction: "After the cognitive work, take a moment to ground your body. Extended exhale, slow and steady.",
      },
    },
    {
      id: "cr-sound",
      type: "sound-therapy",
      title: "Brown Noise",
      durationSeconds: 480,
      content: {
        kind: "sound-therapy",
        noiseType: "brown",
        durationSeconds: 480,
        instruction: "Rest with the brown noise. Notice if any thoughts arise about your tinnitus. Practice observing them without engaging.",
      },
    },
    {
      id: "cr-reflection",
      type: "reflection",
      title: "Session Reflection",
      durationSeconds: 120,
      content: {
        kind: "reflection",
        prompt: "What thought about your tinnitus felt most true at the start of today — and how has your relationship with it shifted?",
        followUp: "What is one more balanced thought you could carry into the rest of the day?",
      },
    },
  ],

  "Acceptance (ACT)": [
    {
      id: "act-intro",
      type: "psychoeducation",
      title: "Acceptance is Not Giving Up",
      durationSeconds: 180,
      content: {
        kind: "psychoeducation",
        slides: [
          {
            heading: "The struggle with tinnitus",
            body: "The harder you fight tinnitus, the louder it gets. This is not weakness — it is neuroscience. Resistance increases threat classification in the brain, which increases gain, which increases the signal. The paradox: acceptance reduces distress more reliably than fighting.",
          },
          {
            heading: "What acceptance actually means",
            body: "Acceptance does not mean liking tinnitus, resigning yourself to suffering, or giving up on treatment. It means allowing the sound to exist without adding a second layer of suffering — the battle against it.",
          },
          {
            heading: "The passengers on a bus",
            body: "Imagine you are driving a bus. Tinnitus is a loud, difficult passenger. You don't have to like the passenger. You don't have to make them comfortable. And you don't have to let them drive. You are still the driver. You can still go where you're going.",
          },
        ],
      },
    },
    {
      id: "act-acceptance",
      type: "acceptance",
      title: "Leaves on a Stream",
      durationSeconds: 300,
      content: {
        kind: "acceptance",
        metaphor: "Imagine a gentle stream. Leaves float by on the surface. Each leaf carries a thought, sensation, or sound — including your tinnitus. Watch each leaf arrive, float past, and disappear downstream. You don't need to grab any leaf. You don't need to push any away. Just watch the stream.",
        practice: "For the next few minutes, notice the tinnitus as if it were a leaf on the stream. It is here. It is moving. It will pass. Even if it feels very present right now, your awareness of it can be spacious rather than trapped.",
      },
    },
    {
      id: "act-breathing",
      type: "breathing",
      title: "Open Awareness Breathing",
      durationSeconds: 200,
      content: {
        kind: "breathing",
        pattern: { inhale: 5, hold: 0, exhale: 5 },
        cycles: 8,
        instruction: "Breathe naturally and slowly. As you exhale, imagine gently releasing any resistance to how things are right now. Not forcing anything. Just softening.",
      },
    },
    {
      id: "act-sound",
      type: "sound-therapy",
      title: "White Noise",
      durationSeconds: 540,
      content: {
        kind: "sound-therapy",
        noiseType: "white",
        durationSeconds: 540,
        instruction: "Let the white noise be part of the soundscape — neither something to chase nor something to escape. Just sounds, coexisting.",
      },
    },
    {
      id: "act-reflection",
      type: "reflection",
      title: "Session Reflection",
      durationSeconds: 120,
      content: {
        kind: "reflection",
        prompt: "In what areas of your life has the struggle against tinnitus been costing you the most?",
        followUp: "What might become available if you could carry tinnitus more lightly — even a little?",
      },
    },
  ],
}

// Fallback for all other modules
Object.assign(BASE_EXERCISES, {
  "Breathing & Anchoring": BASE_EXERCISES["Breathing Exercises"],
  "Challenging Core Beliefs": BASE_EXERCISES["Cognitive Restructuring"],
  "Attention Training": BASE_EXERCISES["Thought Awareness"],
  "Grounding & Presence": BASE_EXERCISES["Acceptance (ACT)"],
  "Values & Committed Action": BASE_EXERCISES["Acceptance (ACT)"],
  "Maintenance Planning": BASE_EXERCISES["Cognitive Restructuring"],
  "Relapse Prevention": BASE_EXERCISES["Psychoeducation"],
})
