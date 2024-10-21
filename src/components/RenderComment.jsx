export const renderComment = (
  comment,
  isReply = false,
  handleEditReply,
  handleEditComment,
  handleDeleteReply,
  handleDeleteComment,
  deletingCommentId,
  handleUpdateReply,
  handleEditComment,
  handleUpdateComment,
  loading
) => (
  <div
    key={comment.id}
    className={`flex space-x-3 ${isReply ? "ml-8 mt-4" : "mt-6"}`}
  >
    <Image
      src={comment.user?.profilePicture || "/no-user.png"}
      width={30}
      height={30}
      className="w-6 object-cover h-6 rounded-full"
      alt={comment.user?.name}
    />
    <div className="flex-grow">
      <div className="bg-gray-100 rounded-lg p-3">
        <div className="flex justify-between items-start">
          <span className="font-semibold text-sm">{comment.user?.name}</span>
          {comment.userId === userId && (
            <div className="relative group">
              <button className="text-gray-500 hover:text-gray-700 transition-colors duration-300">
                <MoreHorizontal size={16} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                <button
                  onClick={() =>
                    isReply
                      ? handleEditReply(comment)
                      : handleEditComment(comment)
                  }
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    isReply
                      ? handleDeleteReply(comment.id, comment.commentId)
                      : handleDeleteComment(comment.id)
                  }
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left transition-colors duration-300"
                  disabled={deletingCommentId === comment.id}
                >
                  {deletingCommentId === comment.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
        {editingComment === comment.id || editingReply === comment.id ? (
          <form
            onSubmit={(e) =>
              isReply
                ? handleUpdateReply(e, comment.id, comment.commentId)
                : handleUpdateComment(e, comment.id)
            }
            className="mt-2"
          >
            <input
              type="text"
              value={isReply ? updatedReply : updatedComment}
              onChange={(e) =>
                isReply
                  ? setUpdatedReply(e.target.value)
                  : setUpdatedComment(e.target.value)
              }
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                type="button"
                onClick={() =>
                  isReply ? setEditingReply(null) : setEditingComment(null)
                }
                className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition-colors duration-300"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm mt-1">{comment.content}</p>
        )}
      </div>
      <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
        <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-300">
          <Heart size={12} />
          <span>Like</span>
        </button>
        <button
          onClick={() =>
            setReplyingTo(replyingTo === comment.id ? null : comment.id)
          }
          className="hover:text-blue-500 transition-colors duration-300"
        >
          Reply
        </button>
        {!isReply && comment.replies && comment.replies.length > 0 && (
          <button
            onClick={() => toggleReplies(comment.id)}
            className="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-300"
          >
            {expandedReplies[comment.id] ? (
              <>
                <ChevronUp size={12} />
                <span>Hide Replies</span>
              </>
            ) : (
              <>
                <ChevronDown size={12} />
                <span>Show Replies ({comment.replies.length})</span>
              </>
            )}
          </button>
        )}
      </div>
      {replyingTo === comment.id && (
        <form
          onSubmit={(e) => handleReplySubmit(e, comment.id)}
          className="mt-3 flex items-center space-x-2"
        >
          <Image
            src="/no-user.png"
            width={30}
            height={30}
            className="w-5 h-5 rounded-full"
            alt="User Avatar"
          />
          <div className="flex-grow relative">
            <input
              type="text"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Write a reply..."
              className="w-full bg-gray-100 rounded-full py-1 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !newReply.trim()}
            >
              <Send size={14} />
            </button>
          </div>
        </form>
      )}
      {!isReply && expandedReplies[comment.id] && comment?.replies && (
        <div className="mt-4 space-y-4">
          {comment?.replies?.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  </div>
)
