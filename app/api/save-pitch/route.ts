import { savePitch } from "@/lib/actions/pitches"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, title, pitchType: type, idea, details } = await request.json()

    const savedPitch = await savePitch({
      userId: user.id,
      title,
      content,
      type,
      metadata: { idea, details },
    })

    return NextResponse.json({ success: true, pitchId: savedPitch.id })
  } catch (error) {
    console.error("Save pitch error:", error)
    return NextResponse.json({ error: "Failed to save pitch." }, { status: 500 })
  }
}
