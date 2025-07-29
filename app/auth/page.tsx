"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/app/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { signIn } = useAuth()
  const { toast } = useToast()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      await signIn(email)
      setEmailSent(true)
      toast({
        title: "Magic link sent!",
        description: "Check your email for the login link.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send magic link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 via-purple-800 to-gray-900 p-4 text-white">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-green-400" />
            </div>
            <CardTitle>Check your email</CardTitle>
            <CardDescription className="text-gray-300">
              We've sent a magic link to {email}. Click the link to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full border-gray-600 text-white hover:bg-gray-700"
              onClick={() => setEmailSent(false)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 via-purple-800 to-gray-900 p-4 text-white">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription className="text-gray-300">
            Enter your email to receive a magic link for sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !email}
            >
              {loading ? "Sending..." : "Send magic link"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-gray-80"
            >
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
