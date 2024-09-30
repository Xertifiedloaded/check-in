"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import useLikeStatus from "@/utils/actions"

export default function Card({ post, streak }) {
  const user = post.user || {}

  const { isLiked, count, toggleLike, loading } = useLikeStatus(
    user.id,
    post.id
  )

  const handleToggleLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleLike()
  }

  return (
    <div className="relative shadow-md border rounded-md bg-white my-3 flex flex-col justify-center items-center p-6">
      <Link
        href={`/user/${user.id}`}
        className="w-full h-full absolute top-0 left-0 z-10"
      >
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
      {streak > 1 && (
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
        className="absolute  gap-1 items-center flex justify-between  right-0 top-0 p-1 z-20"
      >
        <Heart
          size={20}
          fontSize={10}
          fill={isLiked ? "red" : "none"}
          stroke={isLiked ? "red" : "currentColor"}
        />
        <small className="text-xs">
          {count || 0} {count === 1 ? "Like" : "Likes"}
        </small>
      </button>
    </div>
  )
}

export function StreakCard({ userName, userProfilePicture, currentStreak }) {
  return (
    <div className="flex mb-3 justify-between items-center">
      <div className="flex justify-between items-center gap-10">
        <Image
          src={userProfilePicture || "/no-user.png"}
          width={200}
          className="w-[30px] h-[30px] rounded-full"
          height={200}
          alt="img"
        />
        <h1 className="mt-3 text-xs md:text-sm  font-semibold">{userName}</h1>
      </div>

      <div class="text-xs rounded-full bg-[#FFCE51] text-white lg:px-2 px-2 py-1 flex items-center space-x-1">
        <Image
          src={"/flame.svg"}
          width={200}
          className="md:w-[15px] w-[12px] h-[12px] md:h-[15px]"
          height={200}
          alt="img"
        />
        <small class="text-orange-700 text-[9px] md:text-sm  font-semibold">
          {currentStreak} Day{currentStreak > 1 && "s"}
        </small>
      </div>
    </div>
  )
}
