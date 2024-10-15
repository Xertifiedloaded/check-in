import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { Heart, MoreHorizontal, Send } from "lucide-react";

function CommentSection({ postId, userId, comments: initialComments, updateCommentCount }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(initialComments || []);
  const [loading, setLoading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState(null);

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

  return (
    <div className="mt-6 space-y-6">
      <form onSubmit={handleCommentSubmit} className="flex items-center space-x-3">
        <Image
          src="/no-user.png"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
          alt="User Avatar"
        />
        <div className="flex-grow relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-gray-100 rounded-full py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !newComment.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Image
                src={comment.user?.profilePicture || "/no-user.png"}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
                alt={comment.user?.name}
              />
              <div className="flex-grow">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-sm">{comment.user?.name}</span>
                    {comment.userId === userId && (
                      <div className="relative group">
                        <button className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
                          <MoreHorizontal size={16} />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors duration-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left transition-colors duration-300"
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
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                      />
                      <div className="flex justify-end mt-2 space-x-2">
                        <button
                          type="button"
                          onClick={() => setEditingComment(null)}
                          className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition-colors duration-300"
                          disabled={loading}
                        >
                          {loading ? "Updating..." : "Update"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm mt-1">{comment.content}</p>
                  )}
                </div>
                <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-300">
                    <Heart size={12} />
                    <span>Like</span>
                  </button>
                  <button className="hover:text-blue-500 transition-colors duration-300">Reply</button>
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