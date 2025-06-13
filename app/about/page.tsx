"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Twitter, Instagram, Linkedin, MapPin, Calendar, PhoneCallIcon, YoutubeIcon } from "lucide-react"

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [sectionsAnimated, setSectionsAnimated] = useState({
    profile: false,
    story: false,
    contact: false,
  })

  const profileRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)

    const observerOptions = {
      threshold: 0.3,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement

          // Only animate if not already animated
          if (target === profileRef.current && !sectionsAnimated.profile) {
            target.classList.add("animate-in-view")
            setSectionsAnimated((prev) => ({ ...prev, profile: true }))
          } else if (target === cardsRef.current && !sectionsAnimated.story) {
            target.classList.add("animate-in-view")
            setSectionsAnimated((prev) => ({ ...prev, story: true }))
          } else if (target === contactRef.current && !sectionsAnimated.contact) {
            target.classList.add("animate-in-view")
            setSectionsAnimated((prev) => ({ ...prev, contact: true }))
          }
        }
      })
    }, observerOptions)

    const elements = [profileRef.current, cardsRef.current, contactRef.current]
    elements.forEach((el) => el && observer.observe(el))

    return () => observer.disconnect()
  }, [sectionsAnimated])

  return (
    <div className="max-w-4xl mx-auto space-y-20 py-8">
      {/* Hero Section */}
      <section className="space-y-8 text-center py-16">
        <div className="space-y-6">
          <div className="relative">
            <div
              className={`absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-3xl transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
            ></div>
            <h1
              className={`relative text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent transition-all duration-1000 leading-tight pb-4 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              About Me
            </h1>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <div ref={profileRef} className="profile-section opacity-0 translate-y-12">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
            <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-background shadow-2xl transform transition-all duration-500 hover:scale-105">
              <Image
                src="/richky-1.jpg?height=10&width=10"
                alt="Profile"
                fill
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
          </div>

          <div className="space-y-6 text-center lg:text-left flex-1">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Richky Lim</h2>
              <p className="text-xl text-muted-foreground">
                2nd Year Conjoint Bachelor's in Commerce and Science (Accounting and Exercise Science) | University of Auckland
              </p>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Auckland, New Zealand</span>
                <Calendar className="h-4 w-4 ml-4" />
                <span>Student since 2023</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {["Student", "Social Media Influencer"].map((skill, index) => (
                <Badge
                  key={skill}
                  className="px-4 py-2 text-sm font-medium transform transition-all duration-300 hover:scale-110 cursor-default"
                >
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex gap-4 justify-center lg:justify-start">
              <a
                href="mailto:richky.lim@icloud.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="group transform transition-all duration-300 hover:scale-105">
                  <Mail className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  Contact me today
                </Button>
              </a>

              <a
                href="https://linkedin.com/in/richky-lim-7b979831a/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="group transform transition-all duration-300 hover:scale-105"
                >
                  <Linkedin className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Professional Profile
                </Button>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Story Section */}
      <div ref={cardsRef} className="cards-section opacity-0 translate-y-12">
        <Card className="overflow-hidden transform transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="pt-8 space-y-6 relative z-10">
            <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              My Professional Journey
            </h3>

            <div className="space-y-6 text-lg leading-relaxed">
              <p className="transform transition-all duration-500 hover:translate-x-2">
                Hey, I’m Richky Lim, the person behind Ledgr — a space I created to make learning accounting easier and more relatable.
              </p>
              <p className="transform transition-all duration-500 hover:translate-x-2">
                I’m a student at the University of Auckland, studying Business and Science with a focus on Accounting and Exercise Science. Like many others, I used to find accounting confusing — full of terms and formulas that didn’t really click at first. So I started breaking things down in a way that made sense to me, and figured, why not share that process?
              </p>
              <p className="transform transition-all duration-500 hover:translate-x-2">
                That’s what Ledger is all about — simplifying concepts, cutting through the noise, and building a space where students can learn accounting in a way that feels less like a lecture and more like a conversation.
              </p>
              <p className="transform transition-all duration-500 hover:translate-x-2">
                While I’m still learning myself, everything here is built from genuine interest, research, and a desire to help others who might be feeling just as lost as I was when I started.
              </p>
              <p className="transform transition-all duration-500 hover:translate-x-2">
                If you’re someone who wants to get better at accounting — whether you’re in your first paper or prepping for an exam — I hope this blog gives you a bit more clarity and confidence.
              </p>
            </div>

            {/* Professional Workspace Image */}
            <div className="mt-12">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative rounded-2xl overflow-hidden border-2 border-background shadow-2xl transform transition-all duration-500 hover:scale-105">
                  <Image
                    src="/richky-2.jpg?height=400&width=800"
                    alt="Professional workspace and office environment"
                    width={600}
                    height={400}
                    className="object-cover transition-transform duration-700 hover:scale-110 w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-lg font-medium">Leo Xu & Richky Lim</p>
                    <p className="text-sm opacity-90">Where expertise meets innovation in financial services</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Section */}
      <div ref={contactRef} className="contact-section opacity-0 translate-y-12">
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Professional Contact
            </h3>
            <p className="text-muted-foreground text-lg">
              Ready to discuss your financial needs? Reach out through any of these professional channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Mail,
                title: "Email",
                value: "richky.lim@icloud.com",
                color: "from-yellow-300 to-yellow-600",
                href: "mailto:richky.lim@icloud.com",
              },
              {
                icon: Linkedin,
                title: "LinkedIn",
                value: "linkedin.com/in/richky-lim-7b979831a/",
                color: "from-blue-400 to-blue-800",
                href: "https://linkedin.com/in/richky-lim-7b979831a/",
              },
              {
                icon: YoutubeIcon,
                title: "Youtube",
                value: "youtube.com/richkylim_",
                color: "from-red-400 to-red-600",
                href: "https://www.youtube.com/@richkylim_",
              },
              {
                icon: Instagram,
                title: "Instagram",
                value: "@richkylim",
                color: "from-orange-400 to-red-600",
                href: "https://instagram.com/richkylim",
              },
            ].map((contact) => (
              <Card
                key={contact.title}
                className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-xl"
              >
                <a href={contact.href} target="_blank" rel="noopener noreferrer">
                  <CardContent className="pt-6 text-center space-y-4">
                    <div
                      className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${contact.color} p-3 group-hover:animate-pulse`}
                    >
                      <contact.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {contact.title}
                      </h4>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {contact.value}
                      </p>
                    </div>
                  </CardContent>
                </a>
              </Card>
            ))}
          </div>

        </section>
      </div>
    </div>
  )
}
