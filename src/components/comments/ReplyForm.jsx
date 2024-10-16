import React, { useState } from 'react';
import Image from 'next/image';
import { Send } from 'lucide-react';

const ReplyForm = ({ onReplySubmit, replyingTo, setReplyingTo, loading }) => {
  const [newReply, setNewReply] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onReplySubmit(e, newReply);
    setNewReply('');
    setReplyingTo(null);
  };

  return (
    replyingTo && (
      <form onSubmit={handleSubmit} className="reply-form mt-3 flex items-center space-x-2">
        <Image src="/no-user.png" width={32} height={32} className="w-6 h-6 rounded-full" alt="User Avatar" />
        <div className="flex-grow relative">
          <input
            type="text"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Write a reply..."
            className="w-full bg-gray-100 rounded-full py-1 pl-3 pr-10"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500"
            disabled={loading || !newReply.trim()}
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    )
  );
};

export default ReplyForm;