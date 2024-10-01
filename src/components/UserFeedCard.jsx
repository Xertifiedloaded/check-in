import React, { useState } from "react";
import Image from "next/image";
import { Heart, LucideCalendarCheck, MessageCircle } from "lucide-react";
import useLikeStatus from "@/utils/actions";
import CommentSection from "./CommentSection";
import { useSession } from "next-auth/react";


export function FeedUserCard({ post }) {
  const user = post.user || {};
  const { data: session } = useSession()
  const { isLiked, count, toggleLike, loading } = useLikeStatus(
    user.id,
    post.id
  );
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike();
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div
      key={post.id}
      className="relative border rounded-lg shadow-md py-8 px-5 bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col space-y-4"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src={user.profilePicture || "/no-user.png"}
            width={30}
            height={30}
            className="w-[30px] h-[30px] rounded-full"
            alt={post.user.name}
          />
          <p className="capitalize text-base font-semibold text-gray-800">
            {post.user.name || "Unknown User"}
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <LucideCalendarCheck className="text-xs" />
          <span className="text-sm">
            {new Date(post.createdAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
      </div>

      <p className="text-gray-800 text-sm md:text-base">{post.content}</p>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleLike}
            className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-red-600"
            disabled={loading}
          >
            <Heart
              size={24}
              fill={isLiked ? "red" : "none"}
              stroke={isLiked ? "red" : "currentColor"}
            />
            <span>{isLiked ? "Liked" : "Like"}</span>
          </button>
          <span className="text-sm text-gray-500">
            {count || 0} {count === 1 ? "Like" : "Likes"}
          </span>
        </div>

        <button
          onClick={handleToggleComments}
          className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <MessageCircle size={24} />
          <span>{commentCount} {commentCount === 1 ? "Comment" : "Comments"}</span> 
        </button>
      </div>

      {showComments && <CommentSection userId={session?.user?.id} postId={post.id} updateCommentCount={setCommentCount} />}
    </div>
  );
}
