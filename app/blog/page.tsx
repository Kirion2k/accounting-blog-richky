"use client"

import { useEffect, useState } from "react"
import BlogClient from "@/components/blog-client"
import { supabase } from "@/lib/supabase"

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("posts").select("*")
      if (error) {
        console.error("Failed to fetch posts:", error)
      } else {
        setPosts(data || [])
      }
      setLoading(false)
    }

    fetchPosts()
  }, [])

  if (loading) return <div>Loading posts...</div>

  return <BlogClient posts={posts} />
}
