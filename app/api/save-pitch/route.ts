import { createServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const supabase = createServerClient({ cookies })

  const {
    title,
    content,
    idea,
    details,
    pitchType,
  } = await req.json()

  // ✅ Get authenticated user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    })
  }

  // ✅ Save pitch to database
  const { error: insertError } = await supabase
    .from("pitches")
    .insert([
      {
        user_id: user.id,
        title,
        content,
        idea,
        details,
        pitch_type: pitchType,
      },
    ])

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
    })
  }

  return new Response(JSON.stringify({ success: true }))
}
