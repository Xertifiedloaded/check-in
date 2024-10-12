"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import useLikeStatus from "@/utils/actions";

export default function Card({ post, streak }) {
  const user = post.user || {};
  const likes = post.likeCount || 0;


  const { isLiked, toggleLike, loading, count } = useLikeStatus(user.id, post.id);

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleLike(); 
  };

  return (
    <div className="relative shadow-md border rounded-md bg-white my-3 flex flex-col justify-center items-center p-6">
      <Link href={`/user/${user.id}`} className="w-full h-full absolute top-0 left-0 z-10">
        <span className="sr-only">View user profile</span>
      </Link>
      <Image
        src={user.profilePicture || "/no-user-pic.png"}
        width={50}
        className="w-[50px] h-[50px] rounded-full"
        height={50}
        alt={user.name || "User"}
      />

      <h1 className="mt-3 text-sm font-medium">
        {user.name || "Unknown User"}
      </h1>
      {user.currentStreak > 1 && (
        <div className="text-xs justify-center absolute w-[20px] h-[20px] right-1 top-1 rounded-full bg-[#FFCE51] text-white flex items-center space-x-1 z-20">
          <Image
            src="/flame.svg"
            width={15}
            className="w-[15px] h-[15px]"
            height={15}
            alt="Flame icon"
          />
        </div>
      )}

      <button
        onClick={handleToggleLike}
        disabled={loading}
        className="absolute gap-1 items-center flex justify-between right-0 top-0 p-1 z-20"
      >
        <Heart
          size={20}
          fill={isLiked ? "red" : "none"} 
          stroke={isLiked ? "red" : "currentColor"} 
        />
        <small className="text-xs">
          {count} {count === 1 ? "Like" : "Likes"}
        </small>
      </button>
    </div>
  );
}




export function StreakCard({ userName, userProfilePicture, currentStreak }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-3">
      <div className="flex items-center gap-4">
        <Image
          src={userProfilePicture || "/no-user.png"}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover border border-gray-300"
          alt={userName || "User profile picture"}
        />
        <h1 className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">
          {userName}
        </h1>
      </div>

      <div className="flex items-center bg-[#FFCE51] text-white rounded-full px-3 py-1">
        <Image
          src="/flame.svg"
          width={15}
          height={15}
          className="w-4 h-4"
          alt="Streak Flame Icon"
        />
        <small className="text-xs font-semibold ml-1">
          {currentStreak} Day{currentStreak > 1 ? "s" : ""}
        </small>
      </div>
    </div>
  )
}
