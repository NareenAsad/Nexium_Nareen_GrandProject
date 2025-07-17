"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface CopyPitchButtonProps {
  content: string
}

export function CopyPitchButton({ content }: CopyPitchButtonProps) {
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied!",
      description: "Pitch content copied to clipboard.",
    })
  }

  return <Button onClick={handleCopy}>Copy Pitch</Button>
}
