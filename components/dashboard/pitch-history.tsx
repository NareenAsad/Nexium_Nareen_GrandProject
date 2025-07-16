import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar } from "lucide-react"

interface Pitch {
  id: string
  title: string
  type: string
  createdAt: Date
  content: string
}

interface PitchHistoryProps {
  pitches: Pitch[]
}

export function PitchHistory({ pitches }: PitchHistoryProps) {
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
              <div key={pitch.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm line-clamp-2">{pitch.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {pitch.type}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-slate-500 mb-3">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(pitch.createdAt).toLocaleDateString()}
                </div>
                <p className="text-xs text-slate-600 line-clamp-3 mb-3">{pitch.content.substring(0, 150)}...</p>
                <Button variant="ghost" size="sm" className="text-xs">
                  View Full Pitch
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
