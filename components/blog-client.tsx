"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Clock, Eye, TrendingUp, Calendar, User } from "lucide-react"

interface BlogClientProps {
  posts: any[]
}

export default function BlogClient({ posts }: BlogClientProps) {
  const [filteredPosts, setFilteredPosts] = useState(posts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [visiblePosts, setVisiblePosts] = useState(6)
  const [isVisible, setIsVisible] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const postsRef = useRef<HTMLDivElement>(null)

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)))

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in-view")
        }
      })
    }, observerOptions)

    const elements = [heroRef.current, searchRef.current, postsRef.current]
    elements.forEach((el) => el && observer.observe(el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedTag) {
      filtered = filtered.filter((post) => post.tags.includes(selectedTag))
    }

    setFilteredPosts(filtered)
    setVisiblePosts(6) // Reset visible posts when filtering
  }, [searchTerm, selectedTag, posts])

  const loadMorePosts = () => {
    setVisiblePosts((prev) => prev + 6)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTag("")
  }

  // Sum up all views
  const totalProfessionalReads = posts.reduce((sum, p) => sum + (p.views || 0), 0)

  // Compute average reading time (in minutes)
  const avgReadTime =
    posts.length > 0
      ? Math.ceil(
        posts.reduce(
          (sum, p) => sum + (p.reading_time ?? p.readingTime ?? 0),
          0
        ) / posts.length
      )
      : 0

  // Helper to format large numbers,
  function formatNumber(num: number) {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}K` : String(num)
  }


  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div
        ref={heroRef}
        className={`hero-section transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <section className="text-center space-y-8 py-16">
          <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient leading-tight pb-4">
              Financial Insights
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Expert accounting advice, tax strategies, and business financial guidance from certified professionals
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto pt-8">
            {[
              { icon: TrendingUp, label: "Expert Articles", value: posts.length, color: "text-blue-500" },
              { icon: Eye, label: "Professional Reads", value: formatNumber(totalProfessionalReads), color: "text-green-500" },
              { icon: Clock, label: "Avg. Read", value: `${avgReadTime} min`, color: "text-purple-500" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${index * 200 + 400}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 mb-3">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Search and Filter Section */}
      <div ref={searchRef} className="search-section opacity-0 translate-y-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center space-x-4 bg-background border rounded-xl p-6 backdrop-blur-sm">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                <Input
                  type="search"
                  placeholder="Search financial topics, tax strategies, or business advice..."
                  className="pl-12 border-0 bg-transparent text-lg focus:ring-0 focus:outline-none h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="lg"
                className="group/btn transform transition-all duration-300 hover:scale-105"
              >
                <Filter className="h-5 w-5 mr-2 group-hover/btn:rotate-12 transition-transform" />
                Filter
              </Button>
            </div>
          </div>

          {/* Tags Filter */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedTag === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag("")}
              className="transform transition-all duration-300 hover:scale-105"
            >
              All Articles
            </Button>
            {allTags.slice(0, 8).map((tag, index) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag)}
                className={`transform transition-all duration-300 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {tag}
              </Button>
            ))}
          </div>

          {/* Search Results Info */}
          {(searchTerm || selectedTag) && (
            <div className="text-center animate-fade-in">
              <p className="text-muted-foreground">
                Found <span className="font-semibold text-primary">{filteredPosts.length}</span> articles
                {searchTerm && (
                  <>
                    {" "}
                    matching "<span className="font-semibold">{searchTerm}</span>"
                  </>
                )}
                {selectedTag && (
                  <>
                    {" "}
                    tagged with "<span className="font-semibold">{selectedTag}</span>"
                  </>
                )}
              </p>
              <Button variant="ghost" onClick={clearFilters} className="mt-2 text-sm">
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      <div ref={postsRef} className="posts-section opacity-0 translate-y-8">
        {filteredPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(0, visiblePosts).map((post, index) => (
                <article
                  key={post.slug}
                  className={`transform transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <Card className="overflow-hidden h-full transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-2 group border-0 bg-gradient-to-br from-background to-muted/20">
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        {post.videoUrl ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${post.videoUrl.split("v=")[1]?.split("&")[0] || ""}`}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            allowFullScreen
                            title={post.title}
                          />
                        ) : (
                          <Image
                            src={post.cover_image || "/placeholder.svg?height=400&width=600"}
                            alt={post.title}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-110"
                          />
                        )}
                        <div className="absolute top-4 right-4 z-20">
                          <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-0 shadow-lg">
                            <Clock className="w-3 h-3 mr-1" />
                            {post.reading_time} min
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-3">
                        {/* Tags */}
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {Array.isArray(post.tags) &&
                            post.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs transform transition-all duration-300 hover:scale-110 bg-primary/10 text-primary border-0"
                              >
                                {tag}
                              </Badge>
                            ))}
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h2>
                      </CardHeader>

                      <CardContent className="pb-4">
                        <p className="text-muted-foreground line-clamp-3 group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </CardContent>

                      <CardFooter className="flex justify-between items-center pt-0">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>Richky L.</span>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                </article>
              ))}
            </div>

            {/* Load More Button */}
            {visiblePosts < filteredPosts.length && (
              <div className="text-center mt-16">
                <Button
                  onClick={loadMorePosts}
                  size="lg"
                  className="group transform transition-all duration-300 hover:scale-105 px-8 py-3"
                >
                  Load More Articles
                  <TrendingUp className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  Showing {visiblePosts} of {filteredPosts.length} articles
                </p>
              </div>
            )}
          </>
        ) : (
          /* No Results */
          <div className="text-center py-16 animate-fade-in">
            <div className="text-8xl mb-6 opacity-50">📊</div>
            <h3 className="text-2xl font-semibold mb-4">No articles found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find any financial articles matching your search criteria. Try adjusting your filters or
              search terms.
            </p>
            <Button onClick={clearFilters} size="lg" className="transform transition-all duration-300 hover:scale-105">
              View All Articles
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
