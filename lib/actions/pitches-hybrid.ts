// @/lib/actions/pitches-hybrid.ts
"use server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { ObjectId } from "mongodb"
import type { Database } from "@/types/supabase"

// Feature flag to control which database to use
const DATABASE_URL = process.env.DATABASE_URL === 'true'

export interface CreatePitchData {
  title: string
  content: string
  idea?: string
  details?: string
  pitchType: string
}

async function getCurrentUser() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({ 
    cookies: () => cookieStore 
  })
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function savePitch(data: CreatePitchData) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  if (DATABASE_URL) {
    // Save to MongoDB
    try {
      const pitch = await prisma.pitch.create({
        data: {
          userId: user.id,
          title: data.title,
          content: data.content,
          type: data.pitchType,
          idea: data.idea,
          details: data.details,
        },
      })
      return pitch
    } catch (error) {
      console.error("Error saving pitch to MongoDB:", error)
      throw new Error("Failed to save pitch")
    }
  } else {
    // Save to Supabase
    try {
      const cookieStore = cookies()
      const supabase = createServerComponentClient<Database>({ 
        cookies: () => cookieStore 
      })

      // Ensure user exists in Supabase users table
      await supabase.from("users").upsert({
        id: user.id,
        email: user.email!,
      })

      const { data: pitch, error } = await supabase
        .from("pitches")
        .insert({
          user_id: user.id,
          title: data.title,
          content: data.content,
          idea: data.idea,
          details: data.details,
          pitch_type: data.pitchType,
        })
        .select()
        .single()

      if (error) throw error
      return pitch
    } catch (error) {
      console.error("Error saving pitch to Supabase:", error)
      throw new Error("Failed to save pitch")
    }
  }
}

export async function getUserPitches() {
  const user = await getCurrentUser()
  if (!user) return []

  if (DATABASE_URL) {
    // Fetch from MongoDB
    try {
      const pitches = await prisma.pitch.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      })
      
      // Transform MongoDB data to match Supabase format
      return pitches.map(pitch => ({
        id: pitch.id,
        user_id: pitch.userId,
        title: pitch.title,
        content: pitch.content,
        idea: pitch.idea,
        details: pitch.details,
        pitch_type: pitch.type,
        created_at: pitch.createdAt.toISOString(),
      }))
    } catch (error) {
      console.error("Error fetching pitches from MongoDB:", error)
      return []
    }
  } else {
    // Fetch from Supabase
    try {
      const cookieStore = cookies()
      const supabase = createServerComponentClient<Database>({ 
        cookies: () => cookieStore 
      })

      const { data: pitches, error } = await supabase
        .from("pitches")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error
      return pitches || []
    } catch (error) {
      console.error("Error fetching pitches from Supabase:", error)
      return []
    }
  }
}

export async function getPitchById(id: string) {
  const user = await getCurrentUser()
  if (!user) return null

  if (DATABASE_URL) {
    // Fetch from MongoDB
    try {
      if (!ObjectId.isValid(id)) {
        console.error("Invalid MongoDB ObjectId format:", id)
        return null
      }

      const pitch = await prisma.pitch.findFirst({
        where: { id, userId: user.id },
      })

      if (!pitch) return null

      // Transform to match Supabase format
      return {
        id: pitch.id,
        user_id: pitch.userId,
        title: pitch.title,
        content: pitch.content,
        idea: pitch.idea,
        details: pitch.details,
        pitch_type: pitch.type,
        created_at: pitch.createdAt.toISOString(),
      }
    } catch (error) {
      console.error("Error fetching pitch from MongoDB:", error)
      return null
    }
  } else {
    // Fetch from Supabase
    try {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(id)) {
        console.error("Invalid UUID format:", id)
        return null
      }

      const cookieStore = cookies()
      const supabase = createServerComponentClient<Database>({ 
        cookies: () => cookieStore 
      })

      const { data: pitch, error } = await supabase
        .from("pitches")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single()

      if (error) throw error
      return pitch
    } catch (error) {
      console.error("Error fetching pitch from Supabase:", error)
      return null
    }
  }
}

export async function deletePitch(id: string, userId: string) {
  const user = await getCurrentUser()
  if (!user || user.id !== userId) {
    return { success: false, message: "Not authenticated or unauthorized" }
  }

  if (DATABASE_URL) {
    // Delete from MongoDB
    try {
      if (!ObjectId.isValid(id)) {
        return { success: false, message: "Invalid pitch ID format" }
      }

      const deletedPitch = await prisma.pitch.delete({
        where: { 
          id: id,
          userId: userId 
        },
      })

      if (deletedPitch) {
        return { success: true, message: "Pitch deleted successfully" }
      } else {
        return { success: false, message: "Pitch not found" }
      }
    } catch (error) {
      console.error("Error deleting pitch from MongoDB:", error)
      return { success: false, message: "Failed to delete pitch" }
    }
  } else {
    // Delete from Supabase
    try {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(id)) {
        return { success: false, message: "Invalid pitch ID format" }
      }

      const cookieStore = cookies()
      const supabase = createServerComponentClient<Database>({ 
        cookies: () => cookieStore 
      })

      const { error } = await supabase
        .from("pitches")
        .delete()
        .eq("id", id)
        .eq("user_id", userId)

      if (error) {
        console.error("Error deleting pitch from Supabase:", error)
        return { success: false, message: "Failed to delete pitch" }
      }

      return { success: true, message: "Pitch deleted successfully" }
    } catch (error) {
      console.error("Error deleting pitch from Supabase:", error)
      return { success: false, message: "Failed to delete pitch" }
    }
  }
}