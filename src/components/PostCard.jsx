import React from "react"
import Image from "next/image"
import {
  MessageCircle,
  Heart,
  Edit,
  Save,
  Trash,
  MoreHorizontal,
} from "lucide-react"

const TwitterStylePost = ({
  user,
  localPost,
  session,
  isEditing,
  editedContent,
  setEditedContent,
  commentCount,
  likeCount,
  isLiked,
  loading,
  handleToggleComments,
  handleToggleLike,
  handleEditSave,
  handleEditToggle,
  handleDelete,
  showComments,
  CommentSection,
  setCommentCount,
  successMessage,
  error,
}) => {
  return (
    <div className="border-b border-gray-200  duration-200">
      <div className="flex">
        <div className="mr-3">
          <Image
            src={user?.profilePicture || "/no-user.png"}
            width={48}
            height={48}
            className="rounded-full w-[25px] h-[25px] object-cover"
            alt={user.name ?? "deleted user"}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className="font-bold text-black mr-1">
              {user?.name ? user.name.split(" ")[0] : "Unknown User"}
            </span>
            {user?.isVerified && (
              <svg
                className="w-4 h-4 text-blue-500 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
              </svg>
            )}

            <span className="text-gray-500 text-sm mx-1">·</span>
            <span className="text-gray-500 text-xs">
              {new Date(localPost?.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <div className="ml-auto">
              <button className="text-gray-500 hover:text-blue-500">
                <MoreHorizontal size={15} />
              </button>
            </div>
          </div>

          {isEditing ? (
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={4}
            />
          ) : (
            <p className="text-black text-sm leading-[1.8] mb-3">{localPost.content}</p>
          )}

          <div className="flex items-center gap-6 text-gray-500 mt-3">
            <button
              onClick={handleToggleComments}
              className="flex items-center space-x-2 hover:text-blue-500 group"
            >
              <MessageCircle size={18} />
              <span>{commentCount}</span>
            </button>
            <button
              onClick={handleToggleLike}
              className={`flex items-center space-x-2 group ${
                isLiked ? "text-red-500" : "hover:text-red-500"
              }`}
              disabled={loading}
            >
              <Heart
                size={18}
                fill={isLiked ? "currentColor" : "none"}
                className={`${isLiked ? "text-red-500" : ""} `}
              />
              <span>{likeCount}</span>
            </button>
            {session?.user?.id === user.id && (
              <>
                {isEditing ? (
                  <button
                    onClick={handleEditSave}
                    className="flex text-sm items-center space-x-2 hover:text-green-500 group"
                  >
                    <Save size={15} />
                    <span>Save</span>
                  </button>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center text-sm space-x-2 hover:text-blue-500 group"
                  >
                    <Edit size={15} />
                    <span>Edit</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(localPost.id)}
                  className="flex text-sm items-center space-x-2 hover:text-red-500 group"
                >
                  <Trash size={15} />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 p-2 border-t border-gray-200 pt-4">
          <CommentSection
            userId={session?.user?.id}
            postId={localPost.id}
            comments={localPost.comments}
            updateCommentCount={setCommentCount}
          />
        </div>
      )}

      {successMessage && (
        <div
          className="fixed top-0 left-0 right-0 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 transition-all duration-500 ease-in-out"
          role="alert"
        >
          <p>{successMessage}</p>
        </div>
      )}

      {error && (
        <div
          className="fixed top-0 left-0 right-0 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 transition-all duration-500 ease-in-out"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}

export default TwitterStylePost
