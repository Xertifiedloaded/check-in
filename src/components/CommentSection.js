


import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

function CommentSection({ postId, userId, comments: initialComments, updateCommentCount }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(initialComments || []);
  const [loading, setLoading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState({}); // Store reply content per comment
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchNewComments();
    }, 10000);
    return () => clearInterval(intervalId);
  }, [comments]);

  const fetchNewComments = async () => {
    if (comments.length === 0) return;
    const latestComment = comments[0];
    try {
      const response = await axios.get(`/api/comment/comment`, {
        params: {
          postId,
          after: latestComment.createdAt,
        },
      });
      if (response.status === 200) {
        const newComments = response.data.comments;
        if (newComments.length > 0) {
          setComments((prevComments) => [...newComments, ...prevComments]);
        }
      }
    } catch (error) {
      console.error("Error fetching new comments:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setLoading(true);
      try {
        const response = await axios.post("/api/comment/comment", {
          content: newComment,
          postId,
          userId,
        });

        if (response.status === 201) {
          const newCommentObj = response.data;
          setComments((prevComments) => [newCommentObj, ...prevComments]);
          setNewComment("");
          updateCommentCount((prevCount) => prevCount + 1);
        } else {
          console.error("Failed to submit comment");
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setUpdatedComment(comment.content);
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setDeletingCommentId(commentId);
      try {
        const response = await axios.delete(`/api/comment/comment?commentid=${commentId}`);
        if (response.status === 204) {
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId)
          );
          updateCommentCount((prevCount) => prevCount - 1);
        } else {
          console.error("Failed to delete comment");
        }
      } catch (error) {
        if (error.response?.status === 403) {
          alert("You are not authorized to delete this comment.");
        } else {
          console.error("Error deleting comment:", error);
        }
      } finally {
        setDeletingCommentId(null);
      }
    }
  };

  const handleUpdateComment = async (e, commentId) => {
    e.preventDefault();
    if (updatedComment.trim()) {
      setLoading(true);
      try {
        const response = await axios.patch(`/api/comment/comment?commentid=${commentId}`, {
          content: updatedComment,
        });

        if (response.status === 200) {
          const updatedCommentObj = { ...response.data, id: commentId };
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === commentId ? updatedCommentObj : comment
            )
          );
          setEditingComment(null);
          setUpdatedComment("");
        } else {
          console.error("Failed to update comment");
        }
      } catch (error) {
        if (error.response?.status === 403) {
          alert("You are not authorized to update this comment.");
        } else {
          console.error("Error updating comment:", error);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (replyContent[commentId]?.trim()) {
      setLoading(true);
      try {
        const response = await axios.post("/api/comment/reply", {
          content: replyContent[commentId],
          postId,
          userId,
          commentId, // Include the parent comment ID for the reply
        });

        if (response.status === 201) {
          const newReply = response.data;
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === commentId
                ? { ...comment, replies: [...(comment.replies || []), newReply] }
                : comment
            )
          );
          setReplyContent((prev) => ({ ...prev, [commentId]: "" })); // Reset the reply content
          setReplyingToCommentId(null); // Close the reply input
        } else {
          console.error("Failed to submit reply");
        }
      } catch (error) {
        console.error("Error submitting reply:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <form onSubmit={handleCommentSubmit} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full">
        <div className="flex w-full sm:w-auto sm:flex-grow items-center space-x-2">
          <Image
            src="/no-user.png"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
            alt="User Avatar"
          />
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-gray-100 rounded-full py-2 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-500 text-white font-semibold py-2 px-4 rounded-full sm:rounded-md disabled:opacity-50"
          disabled={loading || !newComment.trim()}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-2">
              <Image
                src={comment.user?.profilePicture || "/no-user.png"}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
                alt={comment.user?.name}
              />
              <div className="flex-grow">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-sm">{comment.user?.name}</span>
                    {comment.userId === userId && (
                      <div className="relative group">
                        <button className="text-gray-500 hover:text-gray-700">
                          <MoreHorizontal size={16} />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            disabled={deletingCommentId === comment.id}
                          >
                            {deletingCommentId === comment.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {editingComment === comment.id ? (
                    <form onSubmit={(e) => handleUpdateComment(e, comment.id)} className="mt-2">
                      <input
                        type="text"
                        value={updatedComment}
                        onChange={(e) => setUpdatedComment(e.target.value)}
                        className="w-full bg-gray-200 rounded-full py-2 px-4"
                      />
                    </form>
                  ) : (
                    <p className="mt-2">{comment.content}</p>
                  )}
                  <button
                    onClick={() => {
                      setReplyingToCommentId(replyingToCommentId === comment.id ? null : comment.id);
                      setReplyContent((prev) => ({ ...prev, [comment.id]: "" })); // Reset reply content when toggling
                    }}
                    className="text-blue-500 mt-2"
                  >
                    Reply
                  </button>
                  {replyingToCommentId === comment.id && (
                    <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="mt-2 flex">
                      <input
                        type="text"
                        value={replyContent[comment.id] || ""}
                        onChange={(e) => setReplyContent((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                        placeholder="Write a reply..."
                        className="flex-grow bg-gray-100 rounded-full py-2 px-4"
                      />
                      <button type="submit" className="ml-2 bg-blue-500 text-white rounded-full px-4 py-2">
                        Post
                      </button>
                    </form>
                  )}

                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2 pl-8">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-2">
                          <Image
                            src={reply.user?.profilePicture || "/no-user.png"}
                            width={32}
                            height={32}
                            className="w-6 h-6 rounded-full"
                            alt={reply.user?.name}
                          />
                          <div className="flex-grow">
                            <div className="bg-gray-100 rounded-lg p-2">
                              <span className="font-semibold text-sm">{reply.user?.name}</span>
                              <p className="mt-1">{reply.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;
