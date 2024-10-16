import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Send } from "lucide-react";

const CommentInput = ({ postId, userId, setComments, loading }) => {
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const response = await axios.post("/api/comment/comment", {
          content: newComment,
          postId,
          userId,
        });

        if (response.status === 201) {
          setComments(response.data);
          setNewComment("");
        } else {
          console.error("Failed to submit comment");
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    }
  };

  return (
    <form onSubmit={handleCommentSubmit} className="flex items-center space-x-3">
      <Image src="/no-user.png" width={40} height={40} className="w-10 h-10 rounded-full" alt="User Avatar" />
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
  );
};

export default CommentInput;