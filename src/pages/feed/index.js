"use client"

import axios from "axios"
import { useState, useEffect } from "react"
import { FeedUserCard } from "@/components/UserFeedCard"
import { MessageCircle, RefreshCw, ArrowLeft, Loader2, PenSquare } from "lucide-react"
import Head from "next/head"
import Link from "next/link"

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchPosts = async () => {
    try {
      setRefreshing(true)
      const response = await axios.get("/api/post/feed")
      setPosts(response.data.posts)
      setError(null)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setError("Failed to load posts.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 dark:text-blue-400 animate-spin" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading your feed...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-8 max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Unable to Load Feed
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{error}</p>
            <button
              onClick={fetchPosts}
              className="px-6 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Head>
        <title>Community Feed | Daily Check-in</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta
          name="description"
          content="Explore daily check-ins and connect with our vibrant community sharing their experiences and progress."
        />
      </Head>

      <main className="max-w-4xl mx-auto px-4 pt-16 pb-24">

        <nav className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Return to Dashboard</span>
          </Link>
        </nav>

        <header className="mb-8 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Community Feed
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                See what everyone's been up to today
              </p>
            </div>

            <div className="flex items-center gap-3">
              {posts.length > 0 && (
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                  {posts.length} {posts.length === 1 ? "update" : "updates"}
                </div>
              )}
              <button
                onClick={fetchPosts}
                disabled={refreshing}
                className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </header>


        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center">
              <MessageCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Updates Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-sm mx-auto">
              Be the first to share your progress with the community!
            </p>
          </div>
        ) : (
          <div className="space-y-6   ">
            {posts.map((post) => (
              <div key={post?.id}>
                <FeedUserCard post={post} comments={post.comments} />
              </div>
            ))}
          </div>
        )}
      </main>


      {/* <button 
        className="fixed bottom-8 right-8 bg-blue-600 dark:bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900"
      >
        <PenSquare className="w-6 h-6" />
      </button> */}
    </div>
  )
}