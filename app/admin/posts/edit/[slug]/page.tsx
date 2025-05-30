import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getPostBySlug } from "@/lib/posts"
import PostEditor from "@/components/admin/post-editor"


export default async function EditPostPage({ params }: { params: { slug: string } }) {
  // ✅ await params before destructuring
  const { slug } = params

  const session = await getSession()
  if (!session) redirect("/admin")

  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const safePost = { ...post, tags: Array.isArray(post.tags) ? post.tags : [] }
  return <PostEditor post={safePost} />
}



