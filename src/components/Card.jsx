"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import useLikeStatus from "@/utils/actions"

export default function Card({ post }) {
  const user = post.user || {}
  const likes = post.likeCount || 0
  const streak = post.currentStreak
  const { isLiked, toggleLike, loading, count } = useLikeStatus(
    user.id,
    post.id
  )
  console.log(post.currentStreak)

  const handleToggleLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await toggleLike()
  }

  return (
    <div className="relative shadow-lg border rounded-xl bg-white my-4 flex flex-col items-center p-6 transition-transform duration-300 hover:shadow-2xl hover:border-gray-200 hover:-translate-y-1">
      <Link href={`/user/${user.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View user profile</span>
      </Link>
  
      <div className="relative z-20 flex flex-col items-center">
        <Image
          src={user.profilePicture || "/no-user-pic.png"}
          width={60}
          height={60}
          className="w-[60px] h-[60px] rounded-full border border-gray-200 transition-all hover:border-gray-400"
          alt={user.name || "User"}
        />
  
        <h1 className="mt-3 text-base font-semibold text-gray-800 hover:text-gray-900 transition-colors">
          {user.name || "Unknown User"}
        </h1>
  
        {streak && (
          <div className="absolute top-[-10px] left-[-50px] flex items-center">
            <div className="relative w-[28px] h-[28px] bg-[#FFCE51] rounded-full flex items-center justify-center animate-bounce">
              <Image
                src="/flame.svg"
                width={18}
                height={18}
                alt="Flame icon"
                className="w-[18px] h-[18px]"
              />
            </div>
    
          </div>
        )}
      </div>

      <button
        onClick={handleToggleLike}
        disabled={loading}
        className={`absolute top-3 right-3 flex items-center gap-1 text-gray-600 z-20 
          transition-transform duration-200 ease-in-out hover:scale-110 
          ${isLiked ? "text-red-500" : "hover:text-red-500"} 
          focus:outline-none`}
      >
        <Heart
          size={22}
          fill={isLiked ? "red" : "none"}
          stroke={isLiked ? "red" : "currentColor"}
          className="transition-all duration-300 ease-in-out"
        />
        <small className="text-xs font-medium">
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
