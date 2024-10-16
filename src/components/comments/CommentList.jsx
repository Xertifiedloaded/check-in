import React from 'react';
import ReplyList from './ReplyList';

const CommentList = ({
  comments,
  expandedReplies,
  handleExpandReplies,
  handleDeleteComment,
  handleEditComment,
  replyingTo,
  setReplyingTo,
}) => {
  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <div className="comment-content">
            <p>{comment.content}</p>
            <button onClick={() => handleEditComment(comment.id)}>Edit</button>
            <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
            <button onClick={() => setReplyingTo(comment.id)}>Reply</button>
          </div>

          {/* Replies Section */}
          {comment.replies.length > 0 && (
            <div>
              <button onClick={() => handleExpandReplies(comment.id)}>
                {expandedReplies.includes(comment.id) ? 'Hide Replies' : 'Show Replies'}
              </button>
              {expandedReplies.includes(comment.id) && (
                <ReplyList replies={comment.replies} />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
