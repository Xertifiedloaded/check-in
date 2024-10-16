import React, { useState } from "react";
import Image from "next/image";
import { Heart, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import ReplyInput from "./ReplyInput";

const Comment = ({ comment, userId, setComments, updateCommentCount, setReplyingTo, replyingTo }) => {
  const [expandedReplies, setExpandedReplies] = useState(false);

  const toggleReplies = () => {
    setExpandedReplies(!expandedReplies);
  };

  return (
    <div key={comment.id} className="flex space-x-3 mt-6">
      <Image src={comment.user?.profilePicture || "/no-user.png"} width={40} height={40} className="w-8 h-8 rounded-full" alt={comment.user?.name} />
      <div className="flex-grow">
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex justify-between items-start">
            <span className="font-semibold text-sm">{comment.user?.name}</span>
            {comment.userId === userId && (
              <div className="relative group">
                <button className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
                  <MoreHorizontal size={16} />
                </button>
                {/* Add edit and delete functionality */}
              </div>
            )}
          </div>
          <p className="text-sm mt-1">{comment.content}</p>
        </div>
        <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
          <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-300">
            <Heart size={12} />
            <span>Like</span>
          </button>
          <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="hover:text-blue-500 transition-colors duration-300">
            Reply
          </button>
          {comment.replies && comment.replies.length > 0 && (
            <button onClick={toggleReplies} className="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-300">
              {expandedReplies ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              <span>{expandedReplies ? "Hide Replies" : `Show Replies (${comment.replies.length})`}</span>
            </button>
          )}
        </div>
        {replyingTo === comment.id && <ReplyInput commentId={comment.id} userId={userId} setComments={setComments} />}
        {expandedReplies && comment.replies && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <Comment key={reply.id} comment={reply} userId={userId} setComments={setComments} updateCommentCount={updateCommentCount} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;