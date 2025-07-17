"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { deletePitch } from "@/lib/actions/pitches"

interface DeletePitchButtonProps {
  pitchId: string
  userId: string
  onDeleteSuccess?: () => void // Optional callback for parent component (for client-side actions like refresh)
  redirectPath?: string // New: Optional path to redirect to after successful deletion
  variant?: "ghost" | "destructive"
  size?: "icon" | "sm" | "default" | "lg"
  className?: string
}

export function DeletePitchButton({
  pitchId,
  userId,
  onDeleteSuccess,
  redirectPath, // Destructure new prop
  variant = "destructive",
  size = "sm",
  className,
}: DeletePitchButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this pitch? This action cannot be undone.")) {
      return
    }

    startTransition(async () => {
      const result = await deletePitch(pitchId, userId)

      if (result.success) {
        toast({
          title: "Pitch Deleted",
          description: result.message,
        })
        if (onDeleteSuccess) {
          onDeleteSuccess() // Call client-side callback if provided
        } else if (redirectPath) {
          router.push(redirectPath) // Redirect using client-side router if path provided
        } else {
          router.refresh() // Default to refreshing the current page
        }
      } else {
        toast({
          title: "Deletion Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Button variant={variant} size={size} onClick={handleDelete} disabled={isPending} className={className}>
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      <span className="sr-only">Delete Pitch</span>
    </Button>
  )
}
