"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const pitchTypes = [
  { value: "startup", label: "Startup Pitch" },
  { value: "product", label: "Product Launch" },
  { value: "personal", label: "Personal Brand" },
  { value: "investor", label: "Investor Presentation" },
]

// -------------------- Enhanced FormattedPitchContent --------------------
function FormattedPitchContent({ content, className = "" }: { content: string; className?: string }) {
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
    let body = text.replace(/^#{1,6}\s.+$/gm, '')

    const lines = body.split('\n').filter(line => line.trim())
    if (lines[0] && !lines[0].trim().match(/^\d+\./)) {
      lines.shift()
    }
    body = lines.join('\n')

    const sections = body
      .split(/(?=\d+\.\s)/)
      .filter(section => section.trim())
      .map((section) => {
        const sectionLines = section.trim().split('\n')
        const firstLine = sectionLines[0].trim()
        const sectionTitle = firstLine.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim()
        const sectionContent = sectionLines.slice(1).join('\n').trim()

        if (!sectionTitle || sectionTitle.length > 100 || (sectionTitle.includes('.') && sectionTitle.length > 50)) {
          return null
        }

        return { title: sectionTitle, content: sectionContent }
      })
      .filter(Boolean)

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

  return <div className={className}>{formatContent(content)}</div>
}

// -------------------- Utility: Clean pitch --------------------
function cleanPitchContent(rawContent: any): string {
  if (!rawContent) return ""
  let content = typeof rawContent === "string" ? rawContent : rawContent.text || rawContent.content || ""
  if (typeof content !== "string") content = JSON.stringify(rawContent)
  return content
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .replace(/^```[\w]*\n/, '')
    .replace(/\n```$/, '')
    .replace(/^#+\s*$/gm, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/^\s*[-*+]\s+/gm, '- ')
    .replace(/^\s*(\d+\.)\s+/gm, '$1 ')
}

// -------------------- Utility: Extract title --------------------
function extractTitle(content: string, idea: string, pitchType: string): string {
  const pitchLabel = pitchTypes.find(p => p.value === pitchType)?.label || "Pitch"
  const headingMatch = content.match(/^#{1,6}\s*(.+)$/m)
  if (headingMatch) return headingMatch[1].trim()
  let cleanIdea = idea.trim().replace(/^(A|An|The)\s+/i, '')
  if (cleanIdea.length > 60) cleanIdea = cleanIdea.substring(0, 57) + "..."
  return `${pitchLabel}: ${cleanIdea}`
}

// -------------------- Main Component --------------------
export function PitchGenerator() {
  const [idea, setIdea] = useState("")
  const [type, setType] = useState("")
  const [details, setDetails] = useState("")
  const [generatedPitch, setGeneratedPitch] = useState<{ title: string; pitch: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!idea || !type) {
      toast({
        title: "Missing information",
        description: "Please fill in your idea and select a pitch type.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/generate-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, pitchType: type, details }),
      })

      if (!response.ok) throw new Error("Failed to generate pitch")
      const data = await response.json()
      const cleaned = cleanPitchContent(data.pitch)
      const title = extractTitle(cleaned, idea, type)

      if (!cleaned || cleaned.length < 10) throw new Error("Generated pitch is too short")
      setGeneratedPitch({ title, pitch: cleaned })

      toast({ title: "Pitch generated successfully!", description: "Your AI-powered pitch is ready." })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTemplate = async () => {
    if (!generatedPitch) return
    try {
      const response = await fetch("/api/save-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: generatedPitch.pitch,
          title: generatedPitch.title,
          pitchType: type,
          idea,
          details,
        }),
      })

      if (!response.ok) throw new Error("Failed to save pitch")
      toast({ title: "Template saved", description: "Your pitch has been saved successfully." })
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      })
    }
  }

  const handleCopyToClipboard = async () => {
    if (!generatedPitch) return
    try {
      await navigator.clipboard.writeText(generatedPitch.pitch)
      toast({ title: "Copied to clipboard", description: "Pitch copied successfully." })
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy. Try selecting and copying manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-950 to-purple-950 text-white p-4 rounded-xl">
      <Card className="bg-gray-800 text-white border border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-purple-600" />
            Generate New Pitch
          </CardTitle>
          <CardDescription>Describe your idea and generate a compelling pitch using AI.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="idea">Your Idea *</Label>
            <Input
              className="bg-gray-700 text-white border-gray-600 placeholder-gray-400"
              id="idea"
              placeholder="e.g., A mobile app that helps people find local events"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="type">Pitch Type *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select pitch type" />
              </SelectTrigger>
              <SelectContent>
                {pitchTypes.map((pitchType) => (
                  <SelectItem key={pitchType.value} value={pitchType.value}>
                    {pitchType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="details">Additional Details (Optional)</Label>
            <Textarea
              className="bg-gray-700 text-white border-gray-600 placeholder-gray-400"
              id="details"
              placeholder="Target audience, key features, market size, etc."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>
          <Button onClick={handleGenerate} disabled={loading || !idea || !type} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating pitch...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Pitch
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedPitch && (
        <Card className="bg-gray-800 text-white border border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">{generatedPitch.title}</CardTitle>
            <CardDescription>Your AI-generated pitch is ready. You can copy, edit, or save it.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 prose prose-invert max-w-none">
              <FormattedPitchContent content={generatedPitch.pitch} />
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={handleCopyToClipboard} className="bg-black text-white ">
                Copy to Clipboard
              </Button>
              <Button variant="outline" onClick={handleSaveTemplate} className="bg-black text-white">
                Save as Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
