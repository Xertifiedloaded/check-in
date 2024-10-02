import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { io } from "socket.io-client";

let socket;

function CommentSection({ postId, userId, comments: initialComments, updateCommentCount }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(initialComments || []);
  const [loading, setLoading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [updatedComment, setUpdatedComment] = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  useEffect(() => {
    socket = io("https://check-in-psi.vercel.app");

    socket.on("newComment", (newComment) => {
      setComments((prevComments) => [...prevComments, newComment]);
      updateCommentCount((prevCount) => prevCount + 1);
    });

    socket.on("updatedComment", (updatedComment) => {
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );
    });


    socket.on("deletedComment", (commentId) => {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      updateCommentCount((prevCount) => prevCount - 1);
    });

    return () => {
      socket.off("newComment");
      socket.off("updatedComment");
      socket.off("deletedComment");
    };
  }, []);

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
          socket.emit("createComment", newCommentObj); // Emit the new comment event to the server
          setNewComment("");
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
          socket.emit("updateComment", updatedCommentObj); // Emit the update comment event to the server
          setEditingComment(null);
          setUpdatedComment("");
        } else {
          console.error("Failed to update comment");
        }
      } catch (error) {
        console.error("Error updating comment:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      setDeletingCommentId(commentId);
      try {
        const response = await axios.delete(`/api/comment/comment?commentid=${commentId}`);
        if (response.status === 204) {
          socket.emit("deleteComment", commentId); 
        } else {
          console.error("Failed to delete comment");
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
      } finally {
        setDeletingCommentId(null);
      }
    }
  };

  return (
    <div className="mt-6 space-y-6">
      <form onSubmit={handleCommentSubmit} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow border p-3 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center justify-center sm:w-auto w-full"
          disabled={loading}
        >
          {loading ? (
            <div className="text-sm">commenting...</div>
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
              className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4 bg-gray-50 p-4 rounded-lg"
            >
              <Image
                src={comment.user?.profilePicture || "/no-user.png"}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
                alt={comment.user?.name}
              />
              <div className="flex-1 w-full sm:w-auto">
                <p className="text-sm font-semibold text-gray-800">
                  {comment.user?.name}
                </p>

                {editingComment === comment.id ? (
                  <form
                    onSubmit={(e) => handleUpdateComment(e, comment.id)}
                    className="mt-2 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2"
                  >
                    <input
                      type="text"
                      value={updatedComment}
                      onChange={(e) => setUpdatedComment(e.target.value)}
                      className="flex-grow border p-2 rounded-md focus:outline-none focus:border-blue-500 w-full sm:w-auto"
                    />
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-3 py-1 rounded-md flex items-center justify-center w-full sm:w-auto"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="text-sm">Updating...</span>
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
