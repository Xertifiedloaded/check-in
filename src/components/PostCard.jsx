"use client";
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

const TwitterStylePost = ({
  user,
  localPost,
  session,
  isEditing,
  editedContent,
  setEditedContent,
  commentCount,
  likeCount,
  onClose,
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
    <>
      <div className="bg-white overflow-x-hidden   dark:bg-gray-800 backdrop-blur-lg rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50  mb-6 transition-all duration-200">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-offset-2 ring-blue-500/20 dark:ring-blue-400/30 ring-offset-white dark:ring-offset-gray-800">
                <Image
                  src={user?.profilePicture || "/no-user.png"}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  alt={user?.name ?? "User avatar"}
                />
              </div>
              {user?.isVerified && (
                <div className="absolute -right-0.5 -bottom-0.5 bg-blue-500 rounded-full p-1">
                  <svg
                    className="w-2 h-2 text-white fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {user?.name ? user?.name.split(" ")[0] : "Unknown User"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(localPost?.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-full transition-colors"
            >
              <MoreHorizontal
                size={20}
                className="text-gray-600 dark:text-gray-400"
              />
            </button>

            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1  border border-gray-100 dark:border-gray-700">
                {session?.user?.id === user?.id && (
                  <>
                    <button
                      onClick={handleEditToggle}
                      className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2"
                    >
                      <Edit size={16} />
                      <span>Edit post</span>
                    </button>
                    <button
                      onClick={() => handleDelete(localPost?.id)}
                      className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      <Trash size={16} />
                      <span>Delete</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2"
                >
                  <Bookmark size={16} />
                  <span>{isBookmarked ? "Remove save" : "Save post"}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 pb-4">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none text-gray-800 dark:text-gray-200"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800  dark:text-gray-200 leading-relaxed">
              {localPost?.content}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-6">
            <button
              onClick={handleToggleLike}
              disabled={loading}
              className={`group flex items-center gap-2 transition-colors ${
                isLiked
                  ? "text-rose-500 dark:text-rose-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400"
              }`}
            >
              <Heart
                size={20}
                fill={isLiked ? "currentColor" : "none"}
                className="transition-transform group-hover:scale-110"
              />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>

            <button
              onClick={handleToggleComments}
              className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <MessageCircle
                size={20}
                className="transition-transform group-hover:scale-110"
              />
              <span className="text-sm font-medium">{commentCount}</span>
            </button>

            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
              <Share2
                size={20}
                className="transition-transform hover:scale-110"
              />
            </button>
          </div>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`transition-colors ${
              isBookmarked
                ? "text-blue-500 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
            }`}
          >
            <Bookmark
              size={20}
              fill={isBookmarked ? "currentColor" : "none"}
              className="transition-transform hover:scale-110"
            />
          </button>
        </div>
      </div>
      {showComments && (
        <div className="border-t   border-gray-100 dark:border-gray-700/50">
          <CommentSection
            handleToggleComments={handleToggleComments}
            userId={session?.user?.id}
            onClose={onClose}
            postId={localPost.id}
            comments={localPost.comments}
            updateCommentCount={setCommentCount}
          />
        </div>
      )}
    </>
  );
};

export default TwitterStylePost;
