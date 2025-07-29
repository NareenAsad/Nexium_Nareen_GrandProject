import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { Database } from "@/types/supabase"

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({ 
    cookies: () => cookieStore 
  })
  
  const { title, content, idea, details, pitchType } = await req.json()

  // Get the currently authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    console.error("Auth error:", authError.message)
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  if (!user || !user.id || !user.email) {
    return NextResponse.json({ error: "User not authenticated properly" }, { status: 401 })
  }

  // Ensure user exists in public.users table (upsert)
  const { error: userError } = await supabase
    .from("users")
    .upsert({
      id: user.id,
      email: user.email,
    })

  if (userError) {
    console.error("User upsert error:", userError.message)
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  // Insert the pitch into the database
  const { error: insertError } = await supabase
    .from("pitches")
    .insert({
      user_id: user.id,
      title,
      content,
      idea,
      details,
      pitch_type: pitchType,
    })

  if (insertError) {
    console.error("Insert error:", insertError.message)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}