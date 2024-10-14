"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import useLikeStatus from "@/utils/actions"
import { useEffect, useState } from "react"
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
    <Link
      href={`/user/${user.id}`}
      className="relative shadow-lg border rounded-xl bg-white my-4 flex flex-col items-center p-6 transition-transform duration-300 hover:shadow-2xl hover:border-gray-200 hover:-translate-y-1"
    >
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

        {streak > 1 && (
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
    </Link>
  )
}

export function StreakCard({ userName, userProfilePicture, currentStreak }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-2">
      <div className="flex items-center gap-3">
        <Image
          src={userProfilePicture || "/no-user.png"}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover border border-gray-300"
          alt={userName || "User profile picture"}
        />
        <h1 className="text-sm font-semibold text-gray-800 truncate max-w-[120px]">
          {userName}
        </h1>
      </div>
      <div className="flex items-center  text-black rounded-full px-2 py-1">
        <small className="text-xs font-semibold ml-1">
          <StreakBadge currentStreak={currentStreak} />
        </small>
      </div>
    </div>
  )
}

export function StreakBadge({ currentStreak }) {
  const renderBadge = () => {
    switch (true) {
      case currentStreak >= 30:
        return (
          <div className="badge">
            <span>🌟 {currentStreak} Days</span>
          </div>
        )
      case currentStreak >= 20:
        return (
          <div className="badge">
            <span>🎖️ {currentStreak} Days</span>
          </div>
        )
      case currentStreak >= 10:
        return (
          <div className="badge">
            <span>⚡ {currentStreak} Days</span>
          </div>
        )
      case currentStreak >= 3:
        return (
          <div className="badge">
            <span>🏅 {currentStreak} Days</span>
          </div>
        )
      default:
        return (
          <div className="badge">
            <span>🔥 {currentStreak} Days</span>
          </div>
        )
    }
  }
  return <div className="flex items-center justify-center">{renderBadge()}</div>
}

export function Reward({ currentStreak }) {
  const renderReward = () => {
    if (currentStreak >= 30) return "🎉 You've unlocked a Gold Badge!"
    if (currentStreak >= 10) return "🔥 You've unlocked a Streak Booster!"
    if (currentStreak >= 5) return "🏅 You're on a roll! Keep it up!"
    return "🌟 Keep checking in to earn rewards!"
  }
  return <div className="reward text-center mt-4">{renderReward()}</div>
}

export function ShareStreak({ currentStreak }) {
  const share = () => {
    const shareText = `I've maintained a ${currentStreak}-day streak! Check it out!`
    if (navigator.share) {
      navigator
        .share({
          title: "My Streak Achievement",
          text: shareText,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully!"))
        .catch((error) => console.error("Error sharing:", error))
    } else {
      alert("Sharing is not supported in this browser.")
    }
  }

  return (
    <button
      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out hover:from-purple-600 hover:to-blue-600"
      onClick={share}
    >
      Share Streak
    </button>
  )
}

export function StreakProgress({ currentStreak }) {
  const goalDays = 30
  const goalMonths = 12
  const goalYears = 1

  const goals = {
    days: goalDays,
    months: goalMonths * goalDays,
    years: goalYears * goalMonths * goalDays,
  }

  const [currentGoal, setCurrentGoal] = useState(goals.days)
  const [progressPercentage, setProgressPercentage] = useState(0)

  useEffect(() => {
    setCurrentGoal(goals.days)
    const percentage = Math.min((currentStreak / currentGoal) * 100, 100)
    setProgressPercentage(percentage)
  }, [currentStreak, currentGoal])

  return (
    <div className="streak-progress mt-4">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        {currentStreak}/{currentGoal} Days to your next reward!
      </p>
    </div>
  )
}
