import React, { useRef } from "react";
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
    const modalRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (modalRef.current && !modalRef.current.contains(event.target)) {
            handleToggleComments(); 
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [handleToggleComments]);
    
  return (
    <div  ref={modalRef} className="fixed inset-0   z-[100] overflow-scroll bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-xl mx-4 p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1>Comment on Post</h1>
          <X onClick={handleToggleComments} />
        </div>
        <form
          onSubmit={handleCommentSubmit}
          className="flex items-center space-x-3"
        >
          <Image
            src={session?.user?.image ?? "/no-user.png"}
            width={32}
            height={32}
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

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No comments yet
            </p>
          ) : (
            comments.map((comment) => renderComment(comment))
          )}
        </div>
      </div>
    </div>
  );
}
