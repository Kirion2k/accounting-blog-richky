import { supabase } from "./supabase"

export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*',)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  return data
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).single()

  if (error) {
    console.error("Error fetching post by slug:", error)
    return null
  }

  return data
}
