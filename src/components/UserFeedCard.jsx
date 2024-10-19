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
    <div className="bg-white border-b pb-2 mt-2  border-gray-200">
      <div className="flex relative items-start space-x-3">
        <div className="relative inline-block">
          <Image
            src={user.profilePicture || "/no-user.png"}
            width={40}
            height={40}
            className="rounded-full h-10 w-10 object-cover"
            alt={user.name ?? "deleted user"}
          />
          {user && user?.isVerified === true ? (
            <LucideVerified width={20} fill="green" color="white" />
          ) : null}
        </div>

        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-bold  max-w-[160px] text-gray-900">
              {user.name ? user.name.split(" ")[0] : "Unknown User"}
            </span>
            <span className="ml-2 text-gray-500 text-xs">
              @{user.name?.split(" ")[0] ?? "Unknown User"}
            </span>
            <span className="mx-1 text-gray-500">·</span>
            <span className="text-gray-500 text-xs">
              {new Date(localPost.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {isEditing ? (
            <textarea
              className="mt-2 border border-gray-300 rounded p-2 w-full"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          ) : (
            <p className="mt-2 md:text-base text-sm text-gray-900">
              {localPost.content}
            </p>
          )}

          <div className="mt-3 flex items-center justify-start space-x-4">
            <button
              onClick={handleToggleComments}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
            >
              <MessageCircle size={15} />
              <span>{commentCount}</span>
            </button>
            <button
              onClick={handleToggleLike}
              className={`flex items-center space-x-1 ${
                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
              disabled={loading}
            >
              <Heart size={15} fill={isLiked ? "currentColor" : "none"} />
              <span>{likeCount}</span>
            </button>

            {session?.user?.id === user.id && (
              <div className="flex text-xs space-x-4">
                {isEditing ? (
                  <button
                    onClick={handleEditSave}
                    className="flex items-center space-x-1 text-gray-500 hover:text-green-500"
                  >
                    <Save size={15} />
                    <span>Save</span>
                  </button>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center space-x-1 text-gray-500 hover:text-yellow-500"
                  >
                    <Edit size={15} />
                    <span>Edit</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(localPost.id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                >
                  <Trash size={15} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 border-t border-gray-200 pt-4">
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
          className="bg-green-100 fixed left-0 text-0 top-0 border-l-4 border-green-500 text-green-700 p-4 mb-4"
          role="alert"
        >
          <p>{successMessage}</p>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
