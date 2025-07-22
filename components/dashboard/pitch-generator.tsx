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
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const pitchTypes = [
  { value: "startup", label: "Startup Pitch" },
  { value: "product", label: "Product Launch" },
  { value: "personal", label: "Personal Brand" },
  { value: "investor", label: "Investor Presentation" },
]

export function PitchGenerator() {
  const [idea, setIdea] = useState("")
  const [type, setType] = useState("")
  const [details, setDetails] = useState("")
  const [generatedPitch, setGeneratedPitch] = useState("")
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea, type, details }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate pitch")
      }

      const data = await response.json()
      setGeneratedPitch(data.pitch)

      toast({
        title: "Pitch generated successfully!",
        description: "Your AI-powered pitch is ready to use.",
      })

      // Clear form after successful generation
      setIdea("")
      setDetails("")
      setType("")
    } catch (error) {
      console.error("Pitch generation error:", error)
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please check your Groq API key and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-purple-600" />
            Generate New Pitch
            <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Powered by Groq</span>
          </CardTitle>
          <CardDescription>
            Describe your idea and let Groq's lightning-fast AI create a compelling pitch for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="idea">Your Idea *</Label>
            <Input
              id="idea"
              placeholder="e.g., A mobile app that helps people find local events"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="type">Pitch Type *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
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
                Generating with Groq...
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
        <Card>
          <CardHeader>
            <CardTitle>Generated Pitch</CardTitle>
            <CardDescription>Your AI-generated pitch is ready. You can copy, edit, or save it.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-4 rounded-lg prose prose-slate max-w-none">
              {" "}
              {/* Added prose classes */}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedPitch}</ReactMarkdown>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(generatedPitch)}>
                Copy to Clipboard
              </Button>
              <Button variant="outline">Save as Template</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}