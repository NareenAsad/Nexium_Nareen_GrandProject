import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { savePitch } from "@/lib/actions/pitches"

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const body = await request.json()
    const { idea, type, details } = body

    console.log("Incoming pitch data:", { idea, type, details })

    if (!idea || !type) {
      return NextResponse.json(
        { error: "Missing required fields: idea or type" },
        { status: 400 }
      )
    }

    // Construct prompt
    let prompt = `Generate a startup pitch in the "${type}" style for the following idea: ${idea}`

    if (details?.trim()) {
      prompt += `\n\nAdditional context to incorporate: ${details.trim()}`
    }

    console.log("Final prompt:", prompt)

    let generatedPitch = ""

    try {
      const result = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt,
        temperature: 0.7,
        maxTokens: 1000,
      })

      console.log("Groq result:", result)

      if (!result.text) {
        console.error("No text returned from Groq.")
        return NextResponse.json(
          { error: "No text returned from AI model" },
          { status: 502 }
        )
      }

      generatedPitch = result.text
    } catch (aiErr) {
      console.error("Error during AI generation:", aiErr)
      return NextResponse.json(
        { error: "AI generation failed" },
        { status: 500 }
      )
    }

    const savedPitch = await savePitch({
      userId,
      idea,
      type,
      details,
      text: generatedPitch,
    })

    return NextResponse.json(savedPitch)
  } catch (err) {
    console.error("Unhandled error in /api/pitch:", err)
    return NextResponse.json(
      { error: "Failed to generate pitch" },
      { status: 500 }
    )
  }
}
