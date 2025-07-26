import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {

    const { idea, pitchType, details } = await request.json();

    const response = await fetch("http://localhost:5678/webhook-test/generate-pitch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idea, pitchType, details }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate pitch from n8n. Status: ${response.status}`);
    }

    const data = await response.json();
    const pitch = data.pitch || data

    return NextResponse.json({
      pitch,
    })
  } catch (error) {
    console.error("Error generating pitch:", error)
    return NextResponse.json(
      { error: "Failed to generate pitch. Please try again." },
      { status: 500 }
    )
  }
}