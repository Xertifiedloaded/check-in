import React, { useState } from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';

const CommentForm = ({ handleSubmit, newComment, setNewComment, loading }) => {
  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
      <Image src="/no-user.png" width={40} height={40} className="w-10 h-10 rounded-full" alt="User Avatar" />
      <div className="flex-grow relative">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full bg-gray-100 rounded-full py-2 pl-4 pr-12"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500"
          disabled={loading || !newComment.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default CommentForm;