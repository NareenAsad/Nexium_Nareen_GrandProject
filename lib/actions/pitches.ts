"use server" // Moved to the very top of the file

import { prisma } from "@/lib/prisma"
import { ObjectId } from "mongodb"

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
    // Validate id as ObjectId for MongoDB
    if (!ObjectId.isValid(id)) {
      console.error("Invalid pitch ID format:", id)
      return null
    }
    const pitch = await prisma.pitch.findFirst({
      where: { id, userId },
    })
    return pitch
  } catch (error) {
    console.error("Error fetching pitch:", error)
    return null
  }
}

// Delete Pitch Action (now part of the "use server" file)
export async function deletePitch(id: string, userId: string) {
  try {
    // Validate id as ObjectId for MongoDB
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid pitch ID format.")
    }

    const result = await prisma.pitch.deleteMany({
      where: {
        id,
        userId, // Ensure only the owner can delete
      },
    })

    if (result.count === 0) {
      throw new Error("Pitch not found or you don't have permission to delete it.")
    }

    return { success: true, message: "Pitch deleted successfully." }
  } catch (error) {
    console.error("Error deleting pitch:", error)
    return { success: false, message: error instanceof Error ? error.message : "Failed to delete pitch." }
  }
}
