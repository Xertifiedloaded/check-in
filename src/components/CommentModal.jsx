'use client'
import React from "react";
import Image from "next/image";
import { Send, X } from "lucide-react";

export default function CommentModal({
  handleCommentSubmit,
  handleToggleComments,
  session,
  newComment,
  setNewComment,
  loading,
  renderComment,
  comments,
}) {
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      handleToggleComments();
    }
  };

  return (
    <div 
      onClick={handleOutsideClick}
      className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex flex-col justify-end md:justify-center md:items-center"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 w-full md:w-full md:max-w-xl rounded-t-lg md:rounded-lg shadow-lg mx-0 md:mx-4 flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Comments</h2>
          <button 
            onClick={handleToggleComments} 
            className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto px-4 py-2 space-y-4">
          {comments?.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No comments yet
            </p>
          ) : (
            comments?.map((comment) => renderComment(comment))
          )}
        </div>
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
          <form 
            onSubmit={handleCommentSubmit}
            className="flex items-center space-x-3"
          >
            <Image
              src={session?.user?.image ?? "/no-user.png"}
              width={40}
              height={40}
              className="w-10 h-10 object-cover rounded-full border-2 border-gray-300 dark:border-gray-600"
              alt="User Avatar"
            />
            <div className="flex-grow">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-300"
              />
            </div>
            <button
              type="submit"
              className="text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !newComment.trim()}
            >
              {loading ? <div className="replyloader" /> : <Send size={20} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}