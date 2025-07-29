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

// Enhanced FormattedPitchContent component for better formatting
interface FormattedPitchContentProps {
  content: string
  className?: string
}

function FormattedPitchContent({ content, className = "" }: FormattedPitchContentProps) {
  // Function to parse and format the content
  const formatContent = (text: string) => {
    // First, extract title if it exists
    const titleMatch = text.match(/^(?:TITLE:\s*|#\s*)(.*?)(?:\n|$)/i)
    let title = ""
    let bodyContent = text

    if (titleMatch) {
      title = titleMatch[1].trim()
      bodyContent = text.replace(/^(?:TITLE:\s*|#\s*).*?(?:\n|$)/i, '').trim()
    }

    // Process the body content
    const sections = bodyContent
      .split(/(?=\d+\.\s)/)
      .filter(section => section.trim())
      .map((section, index) => {
        const trimmedSection = section.trim()
        if (!trimmedSection) return null
        
        // Check if this is a numbered section
        const isNumberedSection = /^\d+\.\s/.test(trimmedSection)
        
        if (isNumberedSection) {
          // Extract section title and content
          const lines = trimmedSection.split('\n')
          const sectionTitle = lines[0].replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim()
          const sectionContent = lines.slice(1).join('\n').trim()
          
          return (
            <div key={index} className="mb-8">
              <h3 className="font-semibold text-lg mb-4 text-gray-800 border-b border-gray-200 pb-2">
                {index + 1}. {sectionTitle}
              </h3>
              <div className="pl-2">
                {formatSectionContent(sectionContent)}
              </div>
            </div>
          )
        } else {
          // Handle non-numbered content
          return (
            <div key={index} className="mb-6">
              {formatSectionContent(trimmedSection)}
            </div>
          )
        }
      }).filter(Boolean)

    return (
      <div>
        {title && (
          <h1 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500">
            {title}
          </h1>
        )}
        {sections}
      </div>
    )
  }

  // Function to format section content with better bullet point detection
  const formatSectionContent = (text: string) => {
    if (!text.trim()) return null

    return text
      .split('\n')
      .map((line, lineIndex) => {
        const trimmedLine = line.trim()
        if (!trimmedLine) return <br key={lineIndex} />
        
        // Remove markdown formatting
        const cleanLine = trimmedLine.replace(/\*\*/g, '').replace(/\*/g, '')
        
        // Check if line contains a colon (indicating a label: description format)
        if (cleanLine.includes(':')) {
          const colonIndex = cleanLine.indexOf(':')
          const label = cleanLine.substring(0, colonIndex).trim()
          const description = cleanLine.substring(colonIndex + 1).trim()
          
          // Check if this should be a bullet point based on common pitch keywords
          const bulletKeywords = [
            'core features', 'user benefits', 'problem solved',
            'primary users', 'user personas', 'market segment', 
            'competitive landscape', 'pricing strategy', 'value proposition',
            'go-to-market', 'marketing channels', 'timeline',
            'key performance', 'revenue targets', 'user adoption',
            'core passion', 'mission', 'values',
            'key achievements', 'experience highlights', 'skills developed',
            'professional principles', 'industry values', 'quality standards',
            'target audience', 'client types', 'problems solved',
            'short-term goals', 'long-term vision', 'growth areas',
            'contact methods', 'collaboration opportunities', 'next steps',
            'problem identified', 'current solutions', 'our solution', 'solution benefits',
            'total addressable', 'market growth', 'market opportunity', 'customer segments',
            'revenue streams', 'pricing strategy', 'cost structure', 'unit economics',
            'revenue forecast', 'growth metrics', 'profitability timeline', 'funding efficiency',
            'founding team', 'advisory board', 'hiring plan', 'team strengths',
            'amount needed', 'use of funds', 'timeline', 'milestones',
            'expected returns', 'exit strategy', 'risk mitigation', 'investment terms'
          ]
          
          const shouldBeBullet = bulletKeywords.some(keyword => 
            label.toLowerCase().includes(keyword) || 
            label.toLowerCase().replace(/[^a-z\s]/g, '').includes(keyword)
          )
          
          if (shouldBeBullet) {
            return (
              <div key={lineIndex} className="mb-3 flex items-start">
                <span className="text-blue-600 mr-3 font-bold text-lg leading-6">•</span>
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">{label}:</span>
                  <span className="text-gray-700 ml-2">{description}</span>
                </div>
              </div>
            )
          }
        }
        
        // Regular paragraph with justified text
        return (
          <p key={lineIndex} className="text-gray-700 mb-3 text-justify leading-relaxed">
            {cleanLine}
          </p>
        )
      })
      .filter(Boolean)
  }

  return (
    <div className={`prose prose-gray max-w-none ${className}`}>
      {formatContent(content)}
    </div>
  )
}

// Function to clean and format the generated pitch content
function cleanPitchContent(rawContent: any): string {
  if (!rawContent) return ""
  
  let content = ""
  
  // Handle different response formats
  if (typeof rawContent === "string") {
    content = rawContent
  } else if (typeof rawContent === "object") {
    // Try different possible properties
    content = rawContent.text || rawContent.content || rawContent.pitch || rawContent.message || ""
    
    // If it's still an object, try to stringify it
    if (typeof content !== "string") {
      content = JSON.stringify(rawContent)
    }
  }
  
  // Clean the content
  content = content
    // Remove extra whitespace and normalize line breaks
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove multiple consecutive newlines (keep max 2 for paragraph breaks)
    .replace(/\n{3,}/g, '\n\n')
    // Remove leading/trailing whitespace
    .trim()
    // Remove any potential markdown artifacts or unwanted formatting
    .replace(/^```[\w]*\n/, '') // Remove opening code blocks
    .replace(/\n```$/, '') // Remove closing code blocks
    // Clean up any malformed headers
    .replace(/^#+\s*$/gm, '') // Remove empty headers
    // Remove excessive spaces
    .replace(/[ \t]+/g, ' ')
    // Clean up list formatting
    .replace(/^\s*[-*+]\s+/gm, '- ') // Standardize bullet points
    .replace(/^\s*(\d+\.)\s+/gm, '$1 ') // Clean numbered lists
  
  return content
}

// Function to extract or generate a title from the pitch content
function extractTitle(content: string, idea: string, pitchType: string): string {
  if (!content) return `${pitchTypes.find(p => p.value === pitchType)?.label || "Pitch"}: ${idea}`
  
  // Since your n8n workflow doesn't generate a separate title, 
  // let's create a meaningful one from the idea and pitch type
  const pitchTypeLabel = pitchTypes.find(p => p.value === pitchType)?.label || "Pitch"
  
  // Try to find the first heading in the content (if AI added one)
  const headingMatch = content.match(/^#+\s*(.+)$/m)
  if (headingMatch) {
    const title = headingMatch[1].trim()
    console.log("Found heading title:", title)
    return title
  }
  
  // Try to find text after "Executive Summary" or similar intro sections
  const execSummaryMatch = content.match(/(?:Executive Summary|Overview)[:\-\s]+([^\n]+)/i)
  if (execSummaryMatch) {
    const title = execSummaryMatch[1].trim()
    if (title.length > 10 && title.length < 100) {
      console.log("Found executive summary title:", title)
      return title
    }
  }
  
  // Create a clean title from the idea
  let cleanIdea = idea.trim()
  // Capitalize first letter if needed
  cleanIdea = cleanIdea.charAt(0).toUpperCase() + cleanIdea.slice(1)
  
  // Remove common prefixes like "A mobile app that..." 
  cleanIdea = cleanIdea
    .replace(/^(A|An|The)\s+/i, '')
    .replace(/^(mobile\s+app|web\s+app|app|website|platform|service|tool)\s+(that|for|to)\s+/i, '')
  
  // Truncate if too long
  if (cleanIdea.length > 60) {
    cleanIdea = cleanIdea.substring(0, 57) + "..."
  }
  
  const finalTitle = `${pitchTypeLabel}: ${cleanIdea}`
  console.log("Generated title from idea:", finalTitle)
  return finalTitle
}

export function PitchGenerator() {
  const [idea, setIdea] = useState("")
  const [type, setType] = useState("")
  const [details, setDetails] = useState("")
  const [generatedPitch, setGeneratedPitch] = useState<{
    title: string;
    pitch: string;
  } | null>(null);
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
        body: JSON.stringify({ idea, pitchType: type, details }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate pitch")
      }

      const data = await response.json()
      console.log("Raw generated pitch response:", data)

      // Check what properties are available in the response
      console.log("Available properties:", Object.keys(data))
      console.log("data.title:", data.title)
      console.log("data.pitch:", data.pitch)

      // Clean the pitch content
      const cleanedPitch = cleanPitchContent(data.pitch)
      console.log("Cleaned pitch content:", cleanedPitch)

      // Extract or use provided title - since n8n doesn't generate titles, create one
      let title = ""
      if (data.title && typeof data.title === "string" && data.title.trim()) {
        title = data.title.trim()
        console.log("Using provided title:", title)
      } else {
        // Generate a meaningful title since n8n workflow doesn't provide one
        title = extractTitle(cleanedPitch, idea, type)
        console.log("Generated title:", title)
      }

      // Validate that we have content
      if (!cleanedPitch || cleanedPitch.length < 10) {
        throw new Error("Generated pitch content is too short or invalid")
      }

      setGeneratedPitch({
        title: title,
        pitch: cleanedPitch,
      })

      // Debug: Log the final result
      console.log("Final pitch object:", { title, pitch: cleanedPitch })

      toast({
        title: "Pitch generated successfully!",
        description: "Your AI-powered pitch is ready.",
      })
    } catch (error) {
      console.error("Pitch generation error:", error)
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
      const pitchLabel = pitchTypes.find((p) => p.value === type)?.label || "Pitch"
      const shortTitle = idea.length > 50 ? idea.slice(0, 47) + "..." : idea

      // Create a clean, formatted version for saving
      const formattedContent = generatedPitch.pitch
      const saveTitle = generatedPitch.title || `${pitchLabel}: ${shortTitle}`

      const response = await fetch("/api/save-pitch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: formattedContent,
          title: saveTitle,
          pitchType: type,
          idea,
          details,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save pitch")
      }

      toast({
        title: "Template saved",
        description: "Your pitch has been saved successfully.",
      })

      // Optionally refresh the page or update the pitch history
      // You might want to add a callback here to refresh the pitch list
      
    } catch (error) {
      console.error("Save error:", error)
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
      toast({
        title: "Copied to clipboard",
        description: "Pitch content has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try selecting and copying manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-purple-600" />
            Generate New Pitch
          </CardTitle>
          <CardDescription>
            Describe your idea and generate a compelling pitch using AI.
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
        <Card>
          <CardHeader>
            <CardTitle>{generatedPitch.title}</CardTitle>
            <CardDescription>Your AI-generated pitch is ready. You can copy, edit, or save it.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-6 rounded-lg border">
              <FormattedPitchContent 
                content={generatedPitch.pitch} 
                className="text-slate-800"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={handleCopyToClipboard}>
                Copy to Clipboard
              </Button>
              <Button variant="outline" onClick={handleSaveTemplate}>
                Save as Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}