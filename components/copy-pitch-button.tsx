"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ClipboardCopy } from "lucide-react"
import { cn } from "@/lib/utils" 

interface CopyPitchButtonProps {
  content: string
  className?: string
}

export function CopyPitchButton({ content, className }: CopyPitchButtonProps) {
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied!",
      description: "Pitch content copied to clipboard.",
    })
  }

  return (
    <Button
      onClick={handleCopy}
      className={cn("flex items-center gap-2 bg-black text-white hover:bg-gray-800 border border-slate-600 shadow-sm", className)}
    >
      <ClipboardCopy className="w-4 h-4" />
      Copy Pitch
    </Button>
  )
}
