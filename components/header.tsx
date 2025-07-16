import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-slate-900">AI Pitch Writer</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-slate-600 hover:text-slate-900">
            Features
          </Link>
          <Link href="#pricing" className="text-slate-600 hover:text-slate-900">
            Pricing
          </Link>
          <Link href="#examples" className="text-slate-600 hover:text-slate-900">
            Examples
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/auth">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/auth">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
