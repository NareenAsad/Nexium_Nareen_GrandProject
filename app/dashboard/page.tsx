import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { DashboardHeader } from "@/components/dashboard/header"
import { PitchHistory } from "@/components/dashboard/pitch-history"
import { PitchGenerator } from "@/components/dashboard/pitch-generator"
import type { Database } from "@/types/supabase"

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  // Fetch user's pitches directly in the page component
  const { data: pitches, error } = await supabase
    .from("pitches")
    .select("*") // Select all columns to match your database exactly
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Debug: Log the fetched data (remove in production)
  console.log("Dashboard - Fetched pitches:", pitches)
  console.log("Dashboard - User ID:", user.id)
  console.log("Dashboard - Fetch error:", error)

  const userPitches = pitches || []

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PitchGenerator />
          </div>
          <div>
            <PitchHistory pitches={userPitches} userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}