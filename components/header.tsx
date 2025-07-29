import { Button } from "@/components/ui/button"
import { Github, Linkedin, Sparkles } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-800 via-purple-800 to-gray-900 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-blue-400" />
          <span className="text-xl font-bold text-white">AI Pitch Writer</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="https://github.com/NareenAsad/Nexium_Nareen_GrandProject" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" className="flex items-center space-x-2 text-white">
              <Github className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="https://linkedin.com/in/nareen-asad" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" className="flex items-center space-x-2 text-white">
              <Linkedin className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/auth">
            <Button variant="ghost" className="text-white">Sign In</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
