"use client"

import axios from "axios"
import { useState, useEffect } from "react"
import MainHeader from "../MainHeader"
import PageHead from "@/components/PageHead"
import { FeedUserCard } from "@/components/UserFeedCard"
import { MessageCircle, RefreshCw, Filter } from "lucide-react"

export default function Index() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/post/feed")
        setPosts(response.data.posts)
      } catch (error) {
        console.error("Error fetching posts:", error)
        setError("Failed to load posts.")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-600">Loading your feed...</p>
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
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHead
        content="Stay on track, achieve your goals, and beat procrastination together!"
        title="Feed"
      />
      <MainHeader />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 mt-20 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Your Feed
              </h1>
              <p className="text-gray-600 mt-1">
                Stay updated with your community's progress
              </p>
            </div>

            <div className="flex gap-2 sm:gap-4 mt-4 sm:mt-0">
              <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              No Posts Yet
            </h3>
            <p className="text-gray-600 mt-2">
              Be the first to share your progress!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <FeedUserCard post={post} comments={post.comments} />
              </div>
            ))}
          </div>
        )}

        {posts.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-sm">
              {posts.length} {posts.length === 1 ? "post" : "posts"} in your
              feed
            </div>
          </div>
        )}
      </main>

      <button className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  )
}
