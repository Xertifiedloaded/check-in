"use client"
import React, { useEffect, useState } from "react"
import axios from "axios"
import EditPostModal from "@/components/Modal"
import PageHead from "@/components/PageHead"
import ProfileHeader from "../profile/edit/ProfileHeader"

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
        console.log(response)

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
  };

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
      <section className="flex justify-center items-center lg:h-screen h-[90vh] ">
        <div className="loader"></div>
      </section>
    )
  }

  if (error) return <div>{error}</div>

  return (
    <section>
      <PageHead
        content="Stay on track, achieve your goals, and beat procrastination together!"
        title="Manage Your Feed"
      />
      <ProfileHeader />
      <div className="nav-wrapper">
        <h2 className="text-2xl mt-32 font-bold mb-4">Your Checkin</h2>
        {posts.length === 0 ? (
          <p>No posts found for this user.</p>
        ) : (
          <ul>
            {posts?.map((post) => (
              <li key={post.id} className="mb-4">
                <div className="p-4 border border-gray-200 rounded">
                  <p>{post.content}</p>
                  <p className="text-sm text-gray-500">
                    Posted by: {post?.user?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(post.createdAt).toLocaleString()}
                  </p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
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
