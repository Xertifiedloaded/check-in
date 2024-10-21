import React, { useState, useEffect } from "react"
import axios from "axios"
import Image from "next/image"
import {
  Heart,
  MoreHorizontal,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useSession } from "next-auth/react"

function CommentSection({
  postId,
  userId,
  comments: initialComments,
  updateCommentCount,
}) {
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState(initialComments || [])
  const [loading, setLoading] = useState(false)
  const [editingComment, setEditingComment] = useState(null)
  const [updatedComment, setUpdatedComment] = useState("")
  const [deletingCommentId, setDeletingCommentId] = useState(null)
  const [replyingTo, setReplyingTo] = useState(null)
  const [newReply, setNewReply] = useState("")
  const [expandedReplies, setExpandedReplies] = useState({})
  const [editingReply, setEditingReply] = useState(null)
  const [updatedReply, setUpdatedReply] = useState("")
  const { data: session } = useSession()
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchNewComments()
    }, 10000)
    return () => clearInterval(intervalId)
  }, [comments])

  const fetchNewComments = async () => {
    if (comments.length === 0) return
    const latestComment = comments[0]
    try {
      const response = await axios.get(`/api/comment/comment`, {
        params: {
          postId,
          after: latestComment.createdAt,
        },
      })
      if (response.status === 200) {
        const newComments = response.data.comments
        if (newComments.length > 0) {
          setComments((prevComments) => [...newComments, ...prevComments])
        }
      }
    } catch (error) {
      console.error("Error fetching new comments:", error)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      setLoading(true)
      try {
        const response = await axios.post("/api/comment/comment", {
          content: newComment,
          postId,
          userId,
        })

        if (response.status === 201) {
          const newCommentObj = response.data
          setComments((prevComments) => [newCommentObj, ...prevComments])
          setNewComment("")
          updateCommentCount((prevCount) => prevCount + 1)
        } else {
          console.error("Failed to submit comment")
        }
      } catch (error) {
        console.error("Error submitting comment:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleEditComment = (comment) => {
    setEditingComment(comment.id)
    setUpdatedComment(comment.content)
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setDeletingCommentId(commentId)
      try {
        const response = await axios.delete(
          `/api/comment/comment?commentid=${commentId}`
        )
        if (response.status === 204) {
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId)
          )
          updateCommentCount((prevCount) => prevCount - 1)
        } else {
          console.error("Failed to delete comment")
        }
      } catch (error) {
        if (error.response?.status === 403) {
          alert("You are not authorized to delete this comment.")
        } else {
          console.error("Error deleting comment:", error)
        }
      } finally {
        setDeletingCommentId(null)
      }
    }
  }

  const handleUpdateComment = async (e, commentId) => {
    e.preventDefault()
    if (updatedComment.trim()) {
      setLoading(true)
      try {
        const response = await axios.patch(
          `/api/comment/comment?commentid=${commentId}`,
          {
            content: updatedComment,
          }
        )

        if (response.status === 200) {
          const updatedCommentObj = { ...response.data, id: commentId }
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === commentId ? updatedCommentObj : comment
            )
          )
          setEditingComment(null)
          setUpdatedComment("")
        } else {
          console.error("Failed to update comment")
        }
      } catch (error) {
        if (error.response?.status === 403) {
          alert("You are not authorized to update this comment.")
        } else {
          console.error("Error updating comment:", error)
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault()
    if (newReply.trim()) {
      setLoading(true)
      try {
        const response = await axios.post("/api/comment/reply", {
          content: newReply,
          userId,
          commentId,
        })

        if (response.status === 201) {
          const newReplyObj = response.data
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    replies: [newReplyObj, ...(comment.replies || [])],
                  }
                : comment
            )
          )
          setNewReply("")
          setReplyingTo(null)
          updateCommentCount((prevCount) => prevCount + 1)
        } else {
          console.error("Failed to submit reply")
        }
      } catch (error) {
        console.error("Error submitting reply:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleEditReply = (reply) => {
    setEditingReply(reply.id)
    setUpdatedReply(reply.content)
  }

  const handleUpdateReply = async (e, replyId, commentId) => {
    e.preventDefault()
    if (updatedReply.trim()) {
      setLoading(true)
      try {
        const response = await axios.patch(
          `/api/comment/reply?replyId=${replyId}`,
          {
            content: updatedReply,
          }
        )

        if (response.status === 200) {
          const updatedReplyObj = response.data
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    replies: comment.replies.map((reply) =>
                      reply.id === replyId
                        ? { ...reply, ...updatedReplyObj }
                        : reply
                    ),
                  }
                : comment
            )
          )
          setEditingReply(null)
          setUpdatedReply("")
        } else {
          console.error("Failed to update reply")
        }
      } catch (error) {
        console.error("Error updating reply:", error)
        alert("Failed to update reply. Please try again.")
      } finally {
        setLoading(false)
      }
    } else {
      alert("Reply content cannot be empty.")
    }
  }

  const handleDeleteReply = async (replyId, commentId) => {
    if (window.confirm("Are you sure you want to delete this reply?")) {
      try {
        const response = await axios.delete(
          `/api/comment/reply?replyId=${replyId}`
        )
        if (response.status === 204) {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    replies: comment.replies.filter(
                      (reply) => reply.id !== replyId
                    ),
                  }
                : comment
            )
          )
          updateCommentCount((prevCount) => prevCount - 1)
        } else {
          console.error("Failed to delete reply")
        }
      } catch (error) {
        console.error("Error deleting reply:", error)
        alert("Failed to delete reply. Please try again.")
      }
    }
  }

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }))
  }



  const renderComment = (comment, isReply = false) => (
    <div
      key={comment.id}
      className={`flex space-x-3 ${isReply ? "ml-12 mt-2" : "mt-4"}`}
    >
      <Image
        src={comment?.user?.profilePicture || "/no-user.png"}
        width={30}
        height={30}
        className={`${isReply ? "w-6 h-6" : "w-8 h-8"} object-cover rounded-full`}
        alt={comment.user?.name}
      />
      <div className="flex-grow">
        <div className="">
          <span className="font-semibold text-sm mr-2">{comment.user?.name}</span>
          <p className="text-sm">{comment.content}</p>
        </div>
        <div className="flex items-center mt-1 text-xs text-gray-500 space-x-4">
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
          {!isReply && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="font-semibold hover:text-gray-700 transition-colors duration-300"
            >
              Reply
            </button>
          )}

          
          {comment.userId === userId && (
            <div className="relative group">
              <button className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
                <MoreHorizontal size={16} />
              </button>
              <div className="absolute left-0 mt-2 w-32 bg-white rounded-md shadow-lg hidden group-hover:block">
                <button
                  onClick={() => isReply ? handleEditReply(comment) : handleEditComment(comment)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => isReply ? handleDeleteReply(comment.id, comment.commentId) : handleDeleteComment(comment.id)}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left transition-colors duration-300"
                  disabled={deletingCommentId === comment.id}
                >
                  {deletingCommentId === comment.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
        {(editingComment === comment.id || editingReply === comment.id) && (
          <form
            onSubmit={(e) => isReply ? handleUpdateReply(e, comment.id, comment.commentId) : handleUpdateComment(e, comment.id)}
            className="mt-2"
          >
            <input
              type="text"
              value={isReply ? updatedReply : updatedComment}
              onChange={(e) => isReply ? setUpdatedReply(e.target.value) : setUpdatedComment(e.target.value)}
              className="w-full border-b text-sm py-1 focus:outline-none focus:border-blue-500 transition-all duration-300"
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                type="button"
                onClick={() => isReply ? setEditingReply(null) : setEditingComment(null)}
                className="text-gray-500 text-xs hover:text-gray-700 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-blue-500 font-semibold text-xs hover:text-blue-600 transition-colors duration-300"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        )}
        {replyingTo === comment.id && (
          <form
            onSubmit={(e) => handleReplySubmit(e, comment.id)}
            className="mt-2 flex items-center space-x-2"
          >
            <Image
              src={session?.user?.image ?? "/no-user.png"}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full"
              alt="User Avatar"
            />
            <input
              type="text"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Add a reply..."
              className="flex-grow border-b text-sm focus:outline-none focus:border-blue-500 transition-all duration-300"
            />
            <button
              type="submit"
              className="text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !newReply.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        )}
        {!isReply && comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => toggleReplies(comment.id)}
              className="lg:text-sm text-xs text-gray-500 hover:text-gray-700 transition-colors duration-300"
            >
              {expandedReplies[comment.id] ? (
                <>
                  <ChevronUp size={12} className="inline mr-1" />
                  Hide replies
                </>
              ) : (
                <>
                  <ChevronDown size={12} className="inline mr-1" />
                  View replies ({comment.replies.length})
                </>
              )}
            </button>
            {expandedReplies[comment.id] && (
              <div className="mt-2 space-y-2">
                {comment.replies.map((reply) => renderComment(reply, true))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className=" space-y-4">
      <form
        onSubmit={handleCommentSubmit}
        className="flex items-center space-x-3"
      >
        <Image
          src={session?.user?.image ?? "/no-user.png"}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
          alt="User Avatar"
        />
        <div className="flex-grow relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full border-b py-2 text-sm focus:outline-none focus:border-blue-500 transition-all duration-300"
          />
          <button
            type="submit"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !newComment.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet</p>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </div>
    </div>
  )
}

export default CommentSection




