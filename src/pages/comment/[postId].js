"use client"
import { useState, useEffect } from "react"
import { FeedUserCard } from "@/components/UserFeedCard"
import { MessageCircle, RefreshCw } from "lucide-react"
import Head from "next/head"
import { useRouter } from "next/router"
import PostHeader from "../../components/PostAndCommentHeader"



export default function PostIdComment() {
  const router = useRouter()
  const [posts, setPosts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { postId } = router.query

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/comment/${postId}`)
        if (!response.ok) {
          throw new Error("Failed to load posts.")
        }
        const data = await response.json()
        console.log("posts:", data)
        setPosts(data)
      } catch (error) {
        console.error("Error fetching posts:", error)
        setError("Failed to load posts.")
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchPosts()
    }
  }, [postId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Daily Check-in | Comments</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta
          name="description"
          content="Join the discussion and share your thoughts on this post."
        />
      </Head>

      <main className="max-w-4xl mx-auto px-4 pt-16">
        <PostHeader 
          commentsCount={posts?.comments?.length || 0}
          post={posts}
        />

        {posts?.comments?.length === 0 ? (
          <div className="text-center py-7 bg-white rounded-lg shadow-sm">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              No Comments Yet - Start the Discussion
            </h3>
          </div>
        ) : (
          <div className="space-y-4">
            <FeedUserCard post={posts} comments={posts?.comments} />
          </div>
        )}
      </main>

      <button 
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Add comment"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  )
}