import Image from "next/image"
import { notFound } from "next/navigation"
import { getPosts, getPostBySlug } from "@/lib/posts"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"



export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const supabase = createServerComponentClient({ cookies })

  // Try to read current views; default to 0 on any failure
  let currentViews = 0
  const { data: viewRow, error: viewErr } = await supabase
    .from("posts")
    .select("views")
    .eq("slug", slug)
    .single()

  if (!viewErr && viewRow?.views != null) {
    currentViews = viewRow.views
  }

  // Always bump by one (no need to guard on read)
  await supabase
    .from("posts")
    .update({ views: currentViews + 1 })
    .eq("slug", slug)

  // Now fetch full post
  const { data: row, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error || !row) notFound()

  const post = {
    ...row,
    coverImage: row.cover_image,
    readingTime: row.reading_time,
    // views is already in row.views
  }

  return (
    <article className="max-w-3xl mx-auto space-y-8">
      <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all posts
      </Link>

      <div className="space-y-4">
        <div className="flex gap-2">
          {(Array.isArray(post.tags) ? post.tags : []).map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>



        <h1 className="text-4xl font-bold tracking-tighter">{post.title}</h1>

        <div className="flex items-center text-sm text-muted-foreground">
          {/* <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span className="mx-2">•</span> */}
          <span>{post.reading_time} min read</span>
        </div>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-lg">
        {post.videoUrl ? (
          <iframe
            src={`https://www.youtube.com/embed/${post.videoUrl.split("v=")[1]?.split("&")[0] || ""}`}
            className="w-full h-full"
            allowFullScreen
            title={post.title}
          />
        ) : (
          <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
        )}
      </div>

      <div
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />


      <Separator />

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Share this post</h3>
        <div className="flex gap-4">
          <Link href="#" className="text-muted-foreground hover:text-primary">
            Twitter
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            Facebook
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            LinkedIn
          </Link>
        </div>
      </div>
    </article>
  )
}
