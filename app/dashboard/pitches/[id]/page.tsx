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
import { DeletePitchButton } from "@/components/delete-pitch-button"
import type { Database } from "@/types/supabase"

interface PitchDetailPageProps {
  params: Promise<{
    id: string
  }>
}

// Custom component to format pitch content
function FormattedPitchDisplay({ content }: { content: string }) {
  const formatSectionContent = (text: string) => {
    if (!text.trim()) return null

    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim()
      if (!trimmed) return <br key={idx} />
      const clean = trimmed.replace(/\*\*/g, '').replace(/\*/g, '')
      const colonIndex = clean.indexOf(':')

      if (colonIndex !== -1) {
        const label = clean.slice(0, colonIndex).trim()
        const description = clean.slice(colonIndex + 1).trim()
        return (
          <div key={idx} className="mb-4">
            <div className="text-justify">
              <span className="font-semibold text-purple-300">{label}:</span>
              <span className="text-slate-200 ml-2">{description}</span>
            </div>
          </div>
        )
      }

      return (
        <p key={idx} className="text-slate-200 text-justify mb-4 leading-relaxed">
          {clean}
        </p>
      )
    })
  }

  const formatContent = (text: string) => {
    let body = text

    // Remove ALL markdown headings and the title line
    body = body.replace(/^#{1,6}\s.+$/gm, '')
    
    // Remove any line that looks like a title (usually the first meaningful line)
    const lines = body.split('\n').filter(line => line.trim())
    if (lines.length > 0) {
      // Remove the first line if it doesn't start with a number (likely a title)
      if (lines[0] && !lines[0].trim().match(/^\d+\./)) {
        lines.shift()
      }
    }
    body = lines.join('\n')

    const sections = body
      .split(/(?=\d+\.\s)/)
      .filter(section => section.trim().length > 0)
      .map((section) => {
        const sectionLines = section.trim().split('\n')
        const firstLine = sectionLines[0].trim()
        
        // Extract title from first line, removing any existing numbering
        const sectionTitle = firstLine.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim()
        const sectionContent = sectionLines.slice(1).join('\n').trim()

        // Only return if we have a meaningful title (not just content)
        // Skip sections that are just long paragraphs without proper headings
        if (!sectionTitle || sectionTitle.length > 100 || sectionTitle.includes('.') && sectionTitle.length > 50) {
          return null
        }

        return {
          title: sectionTitle,
          content: sectionContent
        }
      })
      .filter(Boolean) // Remove any null sections

    return (
      <div className="space-y-8">
        {sections.map((section, index) => (
          <div key={index} className="group">
            <h3 className="text-xl font-bold mb-4 text-white bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent border-b border-purple-500/30 pb-3">
              {index + 1}. {section.title}
            </h3>
            <div className="pl-6 border-l-2 border-purple-500/20 ml-2">
              {formatSectionContent(section.content)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {formatContent(content)}
    </div>
  )
}

export default async function PitchDetailPage({ params }: PitchDetailPageProps) {
  const { id } = await params
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

  const { data: pitch, error } = await supabase
    .from("pitches")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !pitch) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-800 to-gray-900 text-white">
      <DashboardHeader user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white hover:text-white text-sm hover:bg-gradient-to-br hover:from-gray-800 hover:via-slate-800 hover:to-gray-900 transition-all duration-200"
              >
                Back to Dashboard
              </Button>
            </Link>
            <DeletePitchButton
              pitchId={pitch.id}
              userId={user.id}
              redirectPath="/dashboard"
              variant="destructive"
              size="sm"
            />
          </div>

          <Card className="bg-slate-800/90 backdrop-blur-sm text-white border border-slate-700/50 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-4">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent leading-tight">
                  {pitch.title}
                </CardTitle>
                <Badge variant="secondary" className="text-sm bg-purple-700/80 text-white px-3 py-1 backdrop-blur-sm">
                  {pitch.pitch_type || 'Pitch'}
                </Badge>
              </div>
              <CardDescription className="flex items-center text-sm text-slate-300">
                <Calendar className="w-4 h-4 mr-2" />
                Generated on {pitch.created_at ? new Date(pitch.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Unknown date'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 p-8 rounded-xl border border-slate-700/50 backdrop-blur-sm shadow-inner">
                <FormattedPitchDisplay content={pitch.content} />
              </div>
              
              <div className="mt-8 flex gap-4">
                <CopyPitchButton
                  content={pitch.content}
                  className="bg-black text-white hover:bg-gray-800 border border-slate-600 shadow-sm"
                />
                <Button
                  className="bg-black text-white hover:bg-gray-800 border border-slate-600 shadow-sm"
                  asChild
                >
                  <Link href="/dashboard">
                    Create New Pitch
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}