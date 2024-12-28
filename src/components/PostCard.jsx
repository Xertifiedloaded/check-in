import React, { useState } from "react";

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
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

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
  const [isImageOpen, setIsImageOpen] = useState(false);

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsImageOpen(true);
  };

  return (
    <>
      <SocialPost
        user={user}
        localPost={localPost}
        session={session}
        isEditing={isEditing}
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        commentCount={commentCount}
        likeCount={likeCount}
        onClose={onClose}
        isLiked={isLiked}
        loading={loading}
        handleToggleComments={handleToggleComments}
        handleToggleLike={handleToggleLike}
        handleEditSave={handleEditSave}
        handleEditToggle={handleEditToggle}
        handleDelete={handleDelete}
        showComments={showComments}
        CommentSection={CommentSection}
        setCommentCount={setCommentCount}
      />

      {showComments && (
        <div className="border-t border-gray-100 dark:border-gray-700/50">
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

const SocialPost = ({
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
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [showImageModal, setShowImageModal] = React.useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${user.name}`,
        text: localPost.content,
        url: window.location.href,
      });
    }
  };

  return (
    <Card className=" bg-white dark:bg-black backdrop-blur-sm">
      <CardHeader className="space-y-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-offset-2 ring-blue-500/20 dark:ring-blue-400/30 ring-offset-white dark:ring-offset-gray-800">
                <img
                  src={user.profilePicture || "/no-user.png"}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {user.isVerified && (
                <div className="absolute -right-0.5 -bottom-0.5 bg-blue-500 rounded-full p-1">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {user.name}
              </h3>
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(localPost.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </time>
            </div>
          </div>

          {session?.user?.id === user.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleEditToggle}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit post
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(localPost.id)}
                  className="text-red-600"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={4}
              className="resize-none"
              placeholder="What's on your mind?"
              disabled={loading}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={handleEditToggle}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleEditSave} disabled={loading}>
                Save changes
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            {localPost.content}
          </p>
        )}

        {localPost.imageUrl && (
          <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
            <DialogTrigger asChild>
              <div className="relative aspect-video rounded-lg overflow-hidden cursor-zoom-in">
                <img
                  src={localPost.imageUrl}
                  alt="Post attachment"
                  className="w-full h-full object-cover transition hover:scale-105"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
              <div className="relative bg-black/90 w-full h-full flex items-center justify-center">
                <img
                  src={localPost.imageUrl}
                  alt="Post attachment"
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-white hover:bg-white/20"
                  onClick={() => setShowImageModal(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-8">
      <button
        onClick={handleToggleLike}
        disabled={loading}
        className="group relative flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
      >
        <div className={`
          relative p-2 rounded-xl
          ${isLiked 
            ? 'bg-rose-50 dark:bg-rose-500/20' 
            : 'bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50'
          }
          transition-all duration-300
        `}>
          <Heart 
            className={`
            h-3 w-3 transition-all duration-300
              ${isLiked 
                ? 'text-rose-500 dark:text-rose-400 scale-110 fill-current' 
                : 'text-gray-600 dark:text-gray-300 group-hover:scale-110'
              }
            `}
          />
          {isLiked && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          )}
        </div>
        <span className={`
          text-sm font-medium transition-colors
          ${isLiked 
            ? 'text-rose-500 dark:text-rose-400' 
            : 'text-gray-700 dark:text-gray-200'
          }
        `}>
          {likeCount}
        </span>
      </button>

      <button
        onClick={handleToggleComments}
        className="group relative flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
      >
        <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors">
          <MessageCircle className="h-3 w-3 text-gray-600 dark:text-gray-300 transition-transform group-hover:scale-110" />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {commentCount}
        </span>
      </button>

      <button
        onClick={handleShare}
        className="group relative flex items-center transition-transform hover:scale-105 active:scale-95"
      >
        <div className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors">
          <Share2 className="h-3 w-3 text-gray-600 dark:text-gray-300 transition-transform group-hover:scale-110 group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-50 group-hover:animate-ping"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          </span>
        </div>
      </button>
    </div>

        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center ${
            isBookmarked ? "text-blue-500 dark:text-blue-400" : ""
          }`}
          onClick={() => setIsBookmarked(!isBookmarked)}
        >
          <Bookmark
            className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
          />
        </Button>
      </CardFooter>
    </Card>
  );
};
