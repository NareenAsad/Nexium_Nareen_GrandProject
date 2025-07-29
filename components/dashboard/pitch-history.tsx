"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar } from "lucide-react"
import Link from "next/link"
import { DeletePitchButton } from "@/components/delete-pitch-button"
import { useRouter } from "next/navigation"

// Update interface to match database columns exactly (including user_id)
interface Pitch {
  id: string
  user_id: string
  title: string
  content: string
  idea: string | null
  details: string | null
  pitch_type: string | null
  created_at: string | null
}

interface PitchHistoryProps {
  pitches: Pitch[]
  userId: string
}

export function PitchHistory({ pitches, userId }: PitchHistoryProps) {
  const router = useRouter()

  // Function to re-fetch pitches after deletion
  const handlePitchDeleted = () => {
    router.refresh() // Revalidate the data for the current page
  }

  // Debug: Log the pitches to see what we're getting
  console.log("Pitches in component:", pitches)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Recent Pitches
        </CardTitle>
        <CardDescription>Your previously generated pitches</CardDescription>
      </CardHeader>
      <CardContent>
        {pitches.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No pitches yet</p>
            <p className="text-sm">Generate your first pitch to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pitches.map((pitch) => (
              <div key={pitch.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors relative">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm line-clamp-2">{pitch.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {pitch.pitch_type || 'Pitch'} {/* Handle null values */}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-slate-500 mb-3">
                  <Calendar className="w-3 h-3 mr-1" />
                  {pitch.created_at ? new Date(pitch.created_at).toLocaleDateString() : 'Unknown date'}
                </div>
                <p className="text-xs text-slate-600 line-clamp-3 mb-3">
                  {pitch.content.substring(0, 150)}...
                </p>
                <div className="flex justify-between items-center">
                  <Link href={`/dashboard/pitches/${pitch.id}`}>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View Full Pitch
                    </Button>
                  </Link>
                  {/* Delete Button */}
                  <DeletePitchButton
                    pitchId={pitch.id}
                    userId={userId}
                    onDeleteSuccess={handlePitchDeleted}
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 text-slate-400 hover:text-red-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}