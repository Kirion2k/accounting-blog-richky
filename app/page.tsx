"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import FeaturedPosts from "@/components/featured-posts"
import { ArrowRight, Calculator, TrendingUp, Users } from "lucide-react"

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-8 py-16 md:py-24">
        <div className="space-y-6 max-w-4xl">
          <div className="relative">
            <div
              className={`absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-3xl transition-all duration-1000 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            ></div>
            <h1
              className={`relative text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                AccountingHub
              </span>
            </h1>
          </div>

          <p
            className={`text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Your premier destination for accounting insights, financial expertise, and business intelligence. Discover
            professional content from certified accountants and industry experts.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 pt-8 justify-center transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <Button asChild size="lg" className="group transform transition-all duration-300 hover:scale-105 px-8 py-4">
              <Link href="/blog">
                <Calculator className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Explore Articles
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="group transform transition-all duration-300 hover:scale-105 px-8 py-4"
            >
              <Link href="/about">
                <Users className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                About the Expert
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-16">
          {[
            {
              icon: Calculator,
              title: "Expert Analysis",
              description: "Professional accounting insights with detailed financial analysis and reporting",
              delay: "600ms",
            },
            {
              icon: TrendingUp,
              title: "Business Intelligence",
              description: "Strategic financial guidance, tax optimization, and business growth strategies",
              delay: "800ms",
            },
            {
              icon: Users,
              title: "Professional Network",
              description: "Connect with CPAs, financial advisors, and business professionals worldwide",
              delay: "1000ms",
            },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className={`group p-6 rounded-2xl bg-gradient-to-br from-background to-muted/30 border border-border/50 backdrop-blur-sm transform transition-all duration-1000 hover:scale-105 hover:shadow-xl ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: feature.delay }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 group-hover:from-primary/20 group-hover:to-purple-500/20 transition-all duration-300">
                  <feature.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Posts Section */}
      <div
        className={`transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: "1200ms" }}
      >
        <FeaturedPosts />
      </div>
    </div>
  )
}
