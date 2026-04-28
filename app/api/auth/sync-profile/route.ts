import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { profile, thiScore, thiAnswers, frequencyHz } = body

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email,
      thi_score: thiScore,
      thi_answers: thiAnswers,
      frequency_hz: frequencyHz,
      tinnitus_duration: profile?.duration,
      tinnitus_sounds: profile?.sounds,
      tinnitus_impacts: profile?.impacts,
      hearing_loss: profile?.hearingLoss,
      stress_level: profile?.stressLevel,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error("sync-profile error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
