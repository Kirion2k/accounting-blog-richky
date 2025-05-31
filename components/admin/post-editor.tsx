"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, ImageIcon } from "lucide-react";
import { createPost, updatePost } from "@/lib/actions";
import "quill/dist/quill.snow.css";
import { useQuill } from "react-quilljs";




interface PostEditorProps {
  post?: any
}

export default function PostEditor({ post }: PostEditorProps) {
  const isEditing = !!post
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    // content holds the HTML string from Quill
    content: post?.content || "",
    coverImage: post?.cover_image || "",
    videoUrl: post?.videoUrl || "",
    tags: post?.tags?.join(", ") || "",
    date: post?.date || new Date().toISOString().split("T")[0],
  })

  // Toggle between image vs. video input
  const [mediaType, setMediaType] = useState<"image" | "video">(
    post?.videoUrl ? "video" : "image"
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Handle text inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Switch between “Cover Image” and “YouTube Video”
  const handleMediaTypeChange = (type: "image" | "video") => {
    setMediaType(type)
    if (type === "image") {
      setFormData((prev) => ({ ...prev, videoUrl: "" }))
    } else {
      setFormData((prev) => ({ ...prev, coverImage: "" }))
    }
  }

  // ------------- QUILL SETUP -------------
  // Define toolbar options: headings, bold, italic, underline, link, lists, clean
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // H1, H2, H3, Normal
      ["bold", "italic", "underline"], // Bold, Italic, Underline
      ["link"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  }
  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "link",
    "list",
  ]

  // Create the editor instance
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: quillModules,
    formats: quillFormats,
  })

  // When Quill instance is ready, sync HTML <-> state
  useEffect(() => {
    if (quill) {
      // If editing an existing post, set its HTML into Quill on mount
      if (isEditing) {
        quill.root.innerHTML = formData.content
      }

      // Whenever Quill content changes, update formData.content
      quill.on("text-change", () => {
        setFormData((prev) => ({
          ...prev,
          content: quill.root.innerHTML,
        }))
      })
    }
  }, [quill])

  // ------------- FORM SUBMIT -------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // 🚫 Slug validation (no spaces)
    if (/\s/.test(formData.slug)) {
      setError("Slug can’t contain spaces. Use hyphens or underscores instead.")
      setIsSubmitting(false)
      return
    }

    try {
      const postData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
      }

      if (isEditing && post) {
        console.log("↻ updatePost", post.slug, postData)
        await updatePost(post.slug, postData)
      } else {
        console.log("➕ createPost", postData)
        await createPost(postData)
      }

      router.push("/admin/dashboard")
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {error && (
        <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ───────── LEFT COLUMN ───────── */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Post title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="post-url-slug"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of the post"
                rows={3}
                className="w-full rounded-md border px-3 py-2"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="tech, tutorial, web"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Publish Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Media Type Toggle */}
            <div className="space-y-3">
              <Label>Media Type</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={mediaType === "image" ? "default" : "outline"}
                  onClick={() => handleMediaTypeChange("image")}
                  className="flex items-center space-x-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Cover Image</span>
                </Button>

                <Button
                  type="button"
                  variant={mediaType === "video" ? "default" : "outline"}
                  onClick={() => handleMediaTypeChange("video")}
                  className="flex items-center space-x-2"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span>YouTube Video</span>
                </Button>
              </div>
            </div>
          </div>

          {/* ───────── RIGHT COLUMN ───────── */}
          <div className="space-y-4">
            {mediaType === "image" ? (
              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="coverImage"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    required={mediaType === "image"}
                  />
                  <Button type="button" variant="outline" className="flex-shrink-0">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
                {formData.coverImage && (
                  <Card className="overflow-hidden">
                    <div
                      className="aspect-video bg-cover bg-center"
                      style={{ backgroundImage: `url(${formData.coverImage})` }}
                    />
                  </Card>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="videoUrl">YouTube Video URL</Label>
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  required={mediaType === "video"}
                />
                <p className="text-sm text-muted-foreground">
                  Paste the full YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
                </p>
                {formData.videoUrl && (
                  <Card className="overflow-hidden">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${formData.videoUrl.split("v=")[1]?.split("&")[0] ||
                          formData.videoUrl.split("/").pop()?.split("?")[0] ||
                          ""
                          }`}
                        className="w-full h-full"
                        allowFullScreen
                        title="Video preview"
                      />
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ───────── RICH‐TEXT EDITOR ───────── */}
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          {/* Render a <div> container bound to quillRef */}
          <div
            ref={quillRef}
            style={{ minHeight: "300px", backgroundColor: "white" }}
            className="rounded-md border"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Saving..." : isEditing ? "Update Post" : "Publish Post"}
        </button>
      </form>
    </div>
  )
}
