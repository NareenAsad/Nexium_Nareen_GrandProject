import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Shield, History, Users } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "AI-Powered Generation",
    description:
      "Advanced AI models create compelling, professional pitches tailored to your specific needs and industry.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and secure. We never share your ideas or pitches with third parties.",
  },
  {
    icon: History,
    title: "Pitch History",
    description: "Access all your generated pitches anytime. Edit, refine, and reuse your best content.",
  },
  {
    icon: Users,
    title: "Multiple Formats",
    description: "Generate pitches for startups, products, personal branding, and investor presentations.",
  },
]

export function Features() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything you need to create amazing pitches
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Our AI-powered platform provides all the tools you need to craft compelling, professional pitches that get
            results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
