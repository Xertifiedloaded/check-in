import React, { useState } from "react";
import Image from "next/image";
import {
  MessageCircle,
  Heart,
  Edit,
  Save,
  Trash,
  MoreHorizontal,
  Share2,
  Bookmark,
  X,
} from "lucide-react";
import ContentWithLinks from "./ContentWithLink";

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
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="bg-white rounded-lg  transition-all duration-200  ">
      <div className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative flex-shrink-0">
              <Image
                src={user?.profilePicture || "/no-user.png"}
                width={48}
                height={48}
                className="rounded-full w-12 h-12 object-cover ring-2 ring-offset-2 ring-blue-100"
                alt={user?.name ?? "User avatar"}
              />
              {user?.isVerified && (
                <div className="absolute -right-1 -bottom-1 bg-white rounded-full">
                  <svg
                    className="w-5 h-5 text-blue-500 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold flex items-center gap-2 text-gray-900">
                {user?.name ? user.name.split(" ")[0] : "Unknown User"}
                {user?.isOwner && (
                  <Image
                    src="/check.svg"
                    width={20}
                    height={20}
                    className=" w-3 h-3 object-cover "
                    alt={user.name || "User"}
                  />
                )}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(localPost?.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              {showActions ? (
                <X size={18} className="text-gray-600" />
              ) : (
                <MoreHorizontal size={18} className="text-gray-600" />
              )}
            </button>

            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                {session?.user?.id === user.id && (
                  <>
                    <button
                      onClick={handleEditToggle}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Edit size={12} />
                      <span className="text-sm">Edit Post</span>
                    </button>
                    <button
                      onClick={() => handleDelete(localPost.id)}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <Trash size={12} />
                      <span>Delete Post</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Bookmark size={12} />
                  <span>{isBookmarked ? "Remove Bookmark" : "Bookmark"}</span>
                </button>
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                  <Share2 size={12} />
                  <span>Share Post</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[120px]"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="What's on your mind?"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <Save size={12} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          ) : (
            <ContentWithLinks localPost={localPost} />
          )}
        </div>

        <div className="mt-2 flex items-center justify-between  border-t border-gray-100">
          <button
            onClick={handleToggleLike}
            className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${
              isLiked ? "text-red-500" : "text-gray-600 hover:bg-gray-100"
            }`}
            disabled={loading}
          >
            <Heart
              size={12}
              fill={isLiked ? "currentColor" : "none"}
              className="transition-transform duration-200 hover:scale-110"
            />
            <span className="text-xs">{likeCount}</span>
          </button>

          <button
            onClick={handleToggleComments}
            className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <MessageCircle size={12} />
            <span className="text-xs">{commentCount}</span>
          </button>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isBookmarked ? "text-blue-500" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Bookmark
              size={12}
              fill={isBookmarked ? "currentColor" : "none"}
              className="transition-transform duration-200 hover:scale-110"
            />
          </button>

          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Share2
              size={12}
              className="transition-transform duration-200 hover:scale-110"
            />
          </button>
        </div>
      </div>

      {showComments && (
        <CommentSection
          userId={session?.user?.id}
          postId={localPost.id}
          comments={localPost.comments}
          updateCommentCount={setCommentCount}
        />
      )}
    </div>
  );
};

export default TwitterStylePost;
