import { prisma } from "@/lib/prisma"

export interface CreatePitchData {
  userId: string
  title: string
  content: string
  type: string
  metadata?: any
}

export async function savePitch(data: CreatePitchData) {
  try {
    const pitch = await prisma.pitch.create({
      data: {
        userId: data.userId,
        title: data.title,
        content: data.content,
        type: data.type,
        metadata: data.metadata,
      },
    })
    return pitch
  } catch (error) {
    console.error("Error saving pitch:", error)
    throw new Error("Failed to save pitch")
  }
}

export async function getUserPitches(userId: string) {
  try {
    const pitches = await prisma.pitch.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    })
    return pitches
  } catch (error) {
    console.error("Error fetching user pitches:", error)
    return []
  }
}

export async function getPitchById(id: string, userId: string) {
  try {
    const pitch = await prisma.pitch.findFirst({
      where: { id, userId },
    })
    return pitch
  } catch (error) {
    console.error("Error fetching pitch:", error)
    return null
  }
}
