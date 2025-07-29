// REMOVED "use client" - This page is now a Server Component
import { notFound, redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CopyPitchButton } from "@/components/copy-pitch-button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { DeletePitchButton } from "@/components/delete-pitch-button"
import type { Database } from "@/types/supabase"

interface PitchDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PitchDetailPage({ params }: PitchDetailPageProps) {
  const { id } = await params
  
  // Fix cookies usage
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({ 
    cookies: () => cookieStore 
  })
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  // Fetch pitch directly instead of using external function
  const { data: pitch, error } = await supabase
    .from("pitches")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id) // Ensure user can only access their own pitches
    .single()

  console.log("Pitch detail - ID:", id)
  console.log("Pitch detail - Fetched pitch:", pitch)
  console.log("Pitch detail - Error:", error)

  if (error || !pitch) {
    console.log("Pitch not found or error occurred")
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900 flex items-center">
              <Button variant="ghost" className="px-2">
                Back to Dashboard
              </Button>
            </Link>
            {/* Delete Button for detail page - now uses redirectPath */}
            <DeletePitchButton
              pitchId={pitch.id}
              userId={user.id}
              redirectPath="/dashboard" // Pass the path to redirect to
              variant="destructive"
              size="sm"
            />
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl font-bold">{pitch.title}</CardTitle>
                <Badge variant="secondary" className="text-sm">
                  {pitch.pitch_type || 'Pitch'}
                </Badge>
              </div>
              <CardDescription className="flex items-center text-sm text-slate-500">
                <Calendar className="w-4 h-4 mr-1" />
                Generated on {pitch.created_at ? new Date(pitch.created_at).toLocaleDateString() : 'Unknown date'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 prose prose-slate max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{pitch.content}</ReactMarkdown>
              </div>
              <div className="mt-6 flex gap-4">
                <CopyPitchButton content={pitch.content} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}