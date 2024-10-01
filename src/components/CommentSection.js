

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

function CommentSection({ postId, userId, updateCommentCount }) { 
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/comment/comment?postId=${postId}`);
        setComments(response.data);
        updateCommentCount(response.data.length);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId, updateCommentCount]);

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
          setComments([...comments, newCommentObj]);
          setNewComment("");
          updateCommentCount(comments.length + 1);
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

  const handleUpdateComment = async (e, commentId) => {
    e.preventDefault();
    if (updatedComment.trim()) {
      setLoading(true);
      try {
        const response = await axios.patch('/api/comment/comment', {
          content: updatedComment,
          userId,
        }, {
          params: { commentid: commentId },
        });

        if (response.status === 200) {
          const updatedComments = comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, content: updatedComment }
              : comment
          );
          setComments(updatedComments);
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

  const handleDeleteComment = async (commentId) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      setDeletingCommentId(commentId);
      try {
        const response = await axios.delete(`/api/comment/comment/${commentId}`, {
          data: { userId },  
        });

        if (response.status === 204) {
          setComments(comments.filter((comment) => comment.id !== commentId));
          updateCommentCount(comments.length - 1);
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

  return (
    <div className="mt-6 space-y-6">
      <form onSubmit={handleCommentSubmit} className="flex space-x-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow border p-3 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center"
          disabled={loading}
        >
          {loading ? (
            <div className="">
              commenting...
            </div>
          ) : (
            "Comment"
          )}
        </button>
      </form>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg"
            >
              <Image
                src={comment.user?.profilePicture || "/no-user.png"}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
                alt={comment.user?.name}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  {comment.user?.name}
                </p>

                {editingComment === comment.id ? (
                  <form
                    onSubmit={(e) => handleUpdateComment(e, comment.id)}
                    className="mt-2 flex items-center space-x-2"
                  >
                    <input
                      type="text"
                      value={updatedComment}
                      onChange={(e) => setUpdatedComment(e.target.value)}
                      className="flex-grow border p-2 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-3 py-1 rounded-md flex items-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm">Updating</span>
                      ) : (
                        "Update"
                      )}
                    </button>
                  </form>
                ) : (
                  <div>
                    <p className="mt-1 text-gray-600">{comment.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      {comment.userId === userId && (
                        <>
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="text-blue-500 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500 text-xs"
                            disabled={deletingCommentId === comment.id}
                          >
                            {deletingCommentId === comment.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;



