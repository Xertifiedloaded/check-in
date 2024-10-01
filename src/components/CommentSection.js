"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

function CommentSection({ postId, updateCommentCount }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

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
      try {
        const response = await axios.post("/api/comment/comment", {
          content: newComment,
          postId, 
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
      }
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <form onSubmit={handleCommentSubmit} className="flex space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow border p-2 rounded-md"
        />
        <button type="submit">Comment</button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-2">
              <Image
                src={comment.user?.profilePicture || "/no-user.png"}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
                alt={comment.user?.name}
              />
              <div>
                <p className="text-sm font-semibold">{comment.user?.name}</p>
                <p className="text-sm text-gray-600">{comment.content}</p>
                <p className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;
