"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPosts } from "@/lib/posts"
import { ArrowRight, Clock, Eye, TrendingUp } from "lucide-react"

export default function FeaturedPosts() {
  const [posts, setPosts] = useState<any[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getPosts()
      setPosts(fetchedPosts.slice(0, 6)) // Show first 6 posts
    }
    fetchPosts()
    setIsVisible(true)
  }, [])

  return (
    <section className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <h2
            className={`text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
          >
            Join us on our Journey
          </h2>
          <p
            className={`text-xl text-muted-foreground transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
            style={{ transitionDelay: "200ms" }}
          >
            Learn Accounting Concepts Here
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          size="lg"
          className={`group transform transition-all duration-1000 hover:scale-105 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          style={{ transitionDelay: "400ms" }}
        >
          <Link href="/blog">
            View All Posts
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <article
            key={post.slug}
            className={`transform transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            style={{ transitionDelay: `${index * 150 + 600}ms` }}
          >
            <Link href={`/blog/${post.slug}`} className="group block">
              <Card className="overflow-hidden h-full transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-2 border-0 bg-gradient-to-br from-background to-muted/20">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Image
                    src={post.cover_image || "/placeholder.svg?height=400&width=600"}
                    alt={post.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-0 shadow-lg">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.reading_time} min
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Badge className="bg-primary text-primary-foreground border-0">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
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
                  <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                </CardHeader>

                <CardContent className="pb-4">
                  <p className="text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors duration-300">
                    {post.excerpt}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between items-center pt-0">
                  <div className="text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{post.views}</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
