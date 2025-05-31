"use server"
import { supabase } from "./supabase"

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function login(email: string, password: string) {
  const supabase = createServerActionClient({ cookies })

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true }
}

export async function logout() {
  const supabase = createServerActionClient({ cookies })
  const { error } = await supabase.auth.signOut()
  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true }
}

// simple word-count reading time (200 wpm)
function calcReadingTime(text: string) {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export async function createPost(postData: any) {
  const supabase = createServerActionClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error("Not logged in")

  const enriched = {
    title: postData.title,
    slug: postData.slug,
    content: postData.content,
    excerpt: postData.excerpt,
    tags: postData.tags              // must be string[]
      .map((t: string) => t.trim())
      .filter(Boolean),     // your table’s `tags` is text
    reading_time: calcReadingTime(postData.content),
    cover_image: postData.coverImage,
    date: postData.date,
    author_id: session.user.id,
    videoUrl: postData.videoUrl
  }

  console.log("⤷ inserting into posts:", enriched)
  try {
    const { data, error } = await supabase
      .from("posts")
      .insert([enriched])
      .select()
    if (error) throw error
    return data![0]
  } catch (err) {
    console.error("🔥 Supabase insert caught:", err)
    throw err
  }
}

export async function updatePost(slug: string, postData: any) {
  const supabase = createServerActionClient({ cookies })
  const {
    data: { session }
  } = await supabase.auth.getSession()
  if (!session) throw new Error('Not logged in')

  const enriched = {
    title: postData.title,
    slug: postData.slug,
    content: postData.content,
    excerpt: postData.excerpt,
    tags: postData.tags.map((t: string) => t.trim()).filter(Boolean),
    reading_time: calcReadingTime(postData.content),
    cover_image: postData.coverImage,
    date: postData.date,
    author_id: session.user.id,
    videoUrl: postData.videoUrl
  }
  console.log('↻ updating post:', slug, enriched)

  try {
    const { data, error } = await supabase
      .from('posts')
      .update(enriched)
      .eq('slug', slug)
      .select()
    if (error) throw error
    return data![0]
  } catch (err) {
    console.error('🔥 Supabase update caught:', err)
    throw err
  }
}

export async function deletePost(slug: string) {
  const supabase = createServerActionClient({ cookies })

  const { error } = await supabase.from("posts").delete().eq("slug", slug)
  if (error) {
    console.error("Delete post failed:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}