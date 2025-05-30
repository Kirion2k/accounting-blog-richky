import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import PostEditor from "@/components/admin/post-editor"

export default function NewPostPage() {
  return <PostEditor />
}