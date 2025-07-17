import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { DashboardHeader } from "@/components/dashboard/header"
import { PitchGenerator } from "@/components/dashboard/pitch-generator"
import { PitchHistory } from "@/components/dashboard/pitch-history"
import { getUserPitches } from "@/lib/actions/pitches"

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  const pitches = await getUserPitches(user.id)

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader user={user} /> {/* Pass user directly */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PitchGenerator />
          </div>
          <div>
            <PitchHistory pitches={pitches} userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
