import React, { useState } from "react"
import {
  Heart,
  MessageCircle,
  Edit,
  Trash,
  Save,
  LucideVerified,
} from "lucide-react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import useLikeStatus from "@/utils/actions"
import CommentSection from "./CommentSection"
import axios from "axios"

export function FeedUserCard({ post }) {
  const { data: session } = useSession()
  const user = post.user || {}
  const {
    isLiked,
    count: likeCount,
    toggleLike,
    loading,
  } = useLikeStatus(user.id, post.id)
  const [showComments, setShowComments] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [commentCount, setCommentCount] = useState(post.commentCount || 0)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(post.content)
  const [localPost, setLocalPost] = useState(post)
  const [error, setError] = useState(null)
  const [isDeleted, setIsDeleted] = useState(false)

  const handleToggleLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleLike()
  }
  const showSuccessMessage = (message) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage("")
    }, 60000)
  }

  const handleToggleComments = () => {
    setShowComments(!showComments)
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleEditSave = async () => {
    try {
      const response = await axios.patch(`/api/post/edit-delete`, {
        postId: localPost.id,
        content: editedContent,
      })

      if (response.status === 200) {
        const { updatedPost } = response.data
        setLocalPost((prev) => ({
          ...prev,
          content: updatedPost.content,
        }))
        setIsEditing(false)
        showSuccessMessage("Post saved successfully!")
      } else {
        setError("Failed to save post.")
      }
    } catch (err) {
      console.error("Error saving post:", err)
      setError("Failed to save post.")
    }
  }

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await axios.delete(`/api/post/edit-delete`, {
          data: { userId: session?.user?.id, postId },
        })

        if (response.status === 200) {
          setIsDeleted(true)
          console.log("Post deleted successfully")
          showSuccessMessage("Post deleted successfully!")
        } else {
          setError("Failed to delete post.")
        }
      } catch (err) {
        console.error("Error deleting post:", err)
        setError("Failed to delete post.")
      }
    }
  }

  if (isDeleted) {
    return null
  }

  return (
    <div className="bg-white rounded-lg    transition-all duration-300 ">
      <div className="flex items-start space-x-4">
        <div className="">
          <Image
            src={user.profilePicture || "/no-user.png"}
            width={35}
            height={35}
            className="rounded-full w-10 h-10 object-cover"
            alt={user.name ?? "deleted user"}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center lg:gap-0 gap-4 mb-2">
            <span className="font-semibold flex items-center gap-2 text-gray-900 mr-2">
              {user.name ? user.name.split(" ")[0] : "Unknown User"}
              {user?.isVerified && (
                <LucideVerified
                  className="  text-green-500 bg-white rounded-full"
                  size={15}
                />
              )}
            </span>
            <span className="text-gray-500 text-xs">
              @{user.name?.split(" ")[0] ?? "Deleted User"}
            </span>
            <span className="mx-2 text-gray-300">·</span>
            <span className="text-gray-500 text-xs">
              {new Date(localPost.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {isEditing ? (
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={3}
            />
          ) : (
            <p className="text-gray-800 mb-3">{localPost.content}</p>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-6">
              <button
                onClick={handleToggleComments}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
              >
                <MessageCircle size={20} />
                <span>{commentCount}</span>
              </button>
              <button
                onClick={handleToggleLike}
                className={`flex items-center space-x-2 transition-colors duration-200 ${
                  isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
                disabled={loading}
              >
                <Heart size={17} fill={isLiked ? "currentColor" : "none"} />
                <span>{likeCount}</span>
              </button>
            </div>

            {session?.user?.id === user.id && (
              <div className="flex space-x-4">
                {isEditing ? (
                  <button
                    onClick={handleEditSave}
                    className="flex items-center space-x-1 text-green-500 hover:text-green-600 transition-colors duration-200"
                  >
                    <Save size={17} />
                    <span>Save</span>
                  </button>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
                  >
                    <Edit size={17} />
                    <span>Edit</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(localPost.id)}
                  className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash size={20} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showComments && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <CommentSection
            userId={session?.user?.id}
            postId={localPost.id}
            comments={localPost.comments}
            updateCommentCount={setCommentCount}
          />
        </div>
      )}

      {successMessage && (
        <div
          className="fixed top-0 left-0 right-0 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 transition-all duration-500 ease-in-out"
          role="alert"
        >
          <p>{successMessage}</p>
        </div>
      )}

      {error && (
        <div
          className="fixed top-0 left-0 right-0 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 transition-all duration-500 ease-in-out"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}
