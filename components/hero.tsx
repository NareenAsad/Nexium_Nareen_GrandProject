"use client" // Add "use client" directive for framer-motion

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion" // Import motion

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="relative py-20 px-4 text-center">
      <motion.div
        className="container mx-auto max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Powered Pitch Generation
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Create Compelling
          <span className="text-blue-600"> Pitches</span>
          <br />
          in Minutes
        </motion.h1>

        <motion.p variants={itemVariants} className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Transform your startup ideas, products, or personal brand into professionally written pitches using advanced
          AI technology.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth">
            <Button size="lg" className="text-lg px-8 py-3">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 text-sm text-slate-500">
          No credit card required • Generate unlimited pitches
        </motion.div>
      </motion.div>
    </section>
  )
}
