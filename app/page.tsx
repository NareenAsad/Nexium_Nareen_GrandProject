import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-800 to-gray-900 text-white">
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  )
}

