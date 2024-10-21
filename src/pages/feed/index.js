"use client"

import axios from "axios"
import { useState, useEffect } from "react"
import { FeedUserCard } from "@/components/UserFeedCard"
import { MessageCircle, RefreshCw, Filter, ArrowLeft } from "lucide-react"
import Head from "next/head"
import Link from "next/link"

export default function Index() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/post/feed")
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center   justify-center min-h-screen bg-gray-50">
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
    <div className="min-h-screen bg-gray-50 ">
  <Head >
        <title className="">Daily Check-in</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta
          name="description"
          content="Catch up with user and see their latest check-ins, activities, and shared experiences from around the world."
        />
      </Head>

      <main className="max-w-4xl  mx-auto px-4 pt-16">
      <div className="flex items-center mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>
      <div className="mb-4 px-4 ">
          <div className="flex flex-col py-4 sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                All Checkin Feeds
              </h1>
              <p className="text-gray-600 text-xs lg:text-base mt-1">
                Stay updated with what others are doing
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 py-3 sm:mt-0">
              {posts.length > 0 && (
                <div className=" text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-sm">
                    {posts.length} {posts.length === 1 ? "post" : "posts"}
                  </div>
                </div>
              )}
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
          <div className="text-center py-7 bg-white rounded-lg shadow-sm">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              No Posts Yet
            </h3>
            <p className="text-gray-600 mt-2 text-xs md:text-sm">
              Be the first to share your progress!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post?.id}
                className="bg-white shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <FeedUserCard post={post} comments={post.comments} />
              </div>
            ))}
          </div>
        )}
      </main>

      <button className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  )
}
