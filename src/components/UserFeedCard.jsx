import React, { useState } from "react"
import { useSession } from "next-auth/react"
import useLikeStatus from "@/utils/actions"
import CommentSection from "./CommentSection"
import axios from "axios"
import TwitterStylePost from "./PostCard"

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

    <TwitterStylePost
    user={user}
    localPost={localPost}
    session={session}
    isEditing={isEditing}
    editedContent={editedContent}
    setEditedContent={setEditedContent}
    commentCount={commentCount}
    likeCount={likeCount}
    isLiked={isLiked}
    loading={loading}
    handleToggleComments={handleToggleComments}
    handleToggleLike={handleToggleLike}
    handleEditSave={handleEditSave}
    handleEditToggle={handleEditToggle}
    handleDelete={handleDelete}
    showComments={showComments}
    CommentSection={CommentSection}
    setCommentCount={setCommentCount}
    successMessage={successMessage}
    error={error}
    />
  )
}
