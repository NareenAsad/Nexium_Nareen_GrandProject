import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="py-20 px-4 bg-blue-600">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to create your perfect pitch?</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of entrepreneurs, founders, and professionals who trust AI Pitch Writer to create compelling
          presentations.
        </p>
        <Link href="/auth">
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            Start Writing Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
