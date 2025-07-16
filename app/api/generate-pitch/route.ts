import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { savePitch } from "@/lib/actions/pitches"

export async function POST(request: NextRequest) {
  try {
    // Await cookies() before using it
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { idea, type, details } = await request.json()

    if (!idea || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate pitch using Groq AI SDK
    const prompt = createPitchPrompt(idea, type, details)

    const { text: generatedPitch } = await generateText({
      model: groq("llama-3.1-8b-instant"), // Updated to a currently supported and fast model
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Save pitch to database
    const savedPitch = await savePitch({
      userId: user.id,
      title: `${type} Pitch: ${idea.substring(0, 50)}...`,
      content: generatedPitch,
      type,
      metadata: { idea, details },
    })

    return NextResponse.json({
      pitch: generatedPitch,
      pitchId: savedPitch.id,
    })
  } catch (error) {
    console.error("Error generating pitch:", error)
    return NextResponse.json({ error: "Failed to generate pitch" }, { status: 500 })
  }
}

function createPitchPrompt(idea: string, type: string, details?: string): string {
  const basePrompts = {
    startup: `Create a compelling startup pitch for the following idea: "${idea}"
    
    Structure the pitch with:
    1. Problem Statement - What problem does this solve?
    2. Solution - How does your idea solve it?
    3. Market Opportunity - Who is your target market?
    4. Business Model - How will you make money?
    5. Competitive Advantage - What makes you unique?
    6. Call to Action - What do you need from investors/partners?
    
    Make it professional, concise, and compelling. Aim for 300-500 words.`,

    product: `Create a professional product launch pitch for: "${idea}"
    
    Include:
    1. Product Overview - What is it and what does it do?
    2. Key Features & Benefits - Why should people care?
    3. Target Audience - Who will use this?
    4. Market Positioning - How does it fit in the market?
    5. Launch Strategy - How will you bring it to market?
    6. Success Metrics - How will you measure success?
    
    Make it engaging and market-ready. Aim for 300-500 words.`,

    personal: `Create a compelling personal brand pitch for: "${idea}"
    
    Structure it with:
    1. Personal Introduction - Who are you?
    2. Unique Value Proposition - What makes you special?
    3. Experience & Expertise - What's your background?
    4. Vision & Goals - Where are you headed?
    5. How You Help Others - What value do you provide?
    6. Call to Action - How can people connect with you?
    
    Make it authentic and professional. Aim for 250-400 words.`,

    investor: `Create a professional investor presentation pitch for: "${idea}"
    
    Include these key sections:
    1. Executive Summary - Brief overview of the opportunity
    2. Problem & Solution - Clear problem-solution fit
    3. Market Analysis - Size, growth, and opportunity
    4. Business Model - Revenue streams and monetization
    5. Financial Projections - Key metrics and growth potential
    6. Team - Why you're the right team to execute
    7. Funding Ask - How much you need and what for
    8. ROI Potential - Expected returns for investors
    
    Make it data-driven and compelling. Aim for 400-600 words.`,
  }

  let prompt = basePrompts[type as keyof typeof basePrompts] || basePrompts.startup

  if (details) {
    prompt += `\n\nAdditional context to incorporate: ${details}`
  }

  prompt += `\n\nWrite in a professional, engaging tone that would impress potential stakeholders. Use clear, concise language and focus on the value proposition.`

  return prompt
}
