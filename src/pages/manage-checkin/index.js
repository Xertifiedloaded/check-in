"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"

import PageHead from "../../components/PageHead"

import { Pencil, Trash2, MessageSquare, Calendar } from "lucide-react"
import EditPostModal from "../../components/Modal"

export default function UserPosts({ userId }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/post/edit-delete", {
          params: { userId },
        })
        setPosts(response.data)
      } catch (err) {
        console.error("Error fetching posts:", err)
        setError("Failed to load posts.")
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [userId])

  const handleEdit = (post) => {
    setCurrentPost(post)
    setModalOpen(true)
  }

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`/api/post/edit-delete`, {
          data: { userId, postId },
        })
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
      } catch (err) {
        console.error("Error deleting post:", err)
        setError("Failed to delete post.")
      }
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setCurrentPost(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <PageHead
        description="Stay on track, achieve your goals, and beat procrastination together!"
        title="Manage Your Feed"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Your Check-ins</h2>
          <div className="bg-blue-50 px-4 py-2 rounded-full text-blue-600 text-sm font-medium">
            {posts.length} Posts
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No posts found. Start sharing your progress!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts?.map((post) => (
              <div 
                key={post.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {post?.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{post?.user?.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{post.content}</p>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(post)}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <EditPostModal
            post={currentPost}
            onClose={handleCloseModal}
            onUpdate={(updatedPost) => {
              setPosts((prevPosts) =>
                prevPosts.map((post) =>
                  post.id === updatedPost.id ? updatedPost : post
                )
              )
            }}
          />
        )}
      </div>
    </section>
  )
}