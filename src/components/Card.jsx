"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Share2 } from "lucide-react"
import useLikeStatus from "@/utils/actions"
import { useEffect, useState } from "react"
import { AiOutlineStar, AiOutlineTrophy } from "react-icons/ai"
import { BsFire } from "react-icons/bs"
import { formatDistanceToNow } from 'date-fns';
export default function Card({ post }) {
  const user = post.user || {}
  console.log(post);
  const { isLiked, toggleLike, loading, count } = useLikeStatus(
    user.id,
    post.id
  )

  const handleToggleLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await toggleLike()
  }

  const truncateContent = (content) => {
    const width = window.innerWidth;
    const length = width <= 768 ? 40 : 25;

    return content.length > length ? content.slice(0, length) + '...' : content;
  };

  return (
    <Link
      // href={`/checkin/${user.id}`}
      href={`/dashboard/${user.id}`}
      className="block p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-3">
        <Image
          src={user.profilePicture ?? "/no-user-pic.png"}
          width={40}
          height={40}
          className="rounded-full w-[30px] h-[30px] object-cover"
          alt={user.name || "User"}
        />
        <div className="flex-grow">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center">
            {user.name?.split(" ")[0] ?? "Unknown User"}
            {user?.isVerified && (
              <svg
                className="w-3 h-3 text-blue-500 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
              </svg>
            )}
          </h2>
          <p className="text-xs text-gray-500">
            @{user.name?.split(" ")[0] ?? "Unknown User"}
          </p>
        </div>
        <button
          onClick={handleToggleLike}
          disabled={loading}
          className={`flex items-center space-x-1 text-sm ${isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          <span>{count}</span>
        </button>
      </div>

      <div className="mt-2 text-sm text-gray-800">
        {truncateContent(post.content)}
      </div>

      {post.currentStreak > 1 && (
        <div className="mt-2 text-xs text-gray-600">
          🔥 {post.currentStreak} day streak
        </div>
      )}
        <div className="mt-2 text-xs text-gray-600">
        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
      </div>
    </Link>
  )
}

export function StreakCard({ userName, userProfilePicture, currentStreak }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3">
        <Image
          src={userProfilePicture || "/no-user.png"}
          width={40}
          height={40}
          className="rounded-full w-[30px] h-[30px] object-cover border border-gray-200"
          alt={userName || "User profile picture"}
        />
        <div>
          <h2 className="text-sm font-medium text-gray-900">
            {userName?.split(" ")[0] ?? "Unknown User"}
          </h2>
          <p className="text-xs text-gray-500">
            {currentStreak > 0
              ? `${currentStreak} day streak`
              : "No current streak"}
          </p>
        </div>
      </div>
      <div className="flex text-sm items-center space-x-1 bg-orange-100 text-orange-600 rounded-full px-3 py-1">
        <StreakBadge currentStreak={currentStreak} />
      </div>
    </div>
  )
}

export function StreakBadge({ currentStreak }) {
  const renderBadge = () => {
    switch (true) {
      case currentStreak >= 30:
        return (
          <div className="badge text-xs">
            <span className="">🌟 {currentStreak} Days</span>
          </div>
        )
      case currentStreak >= 20:
        return (
          <div className="badge text-xs">
            <span className="">🎖️ {currentStreak} Days</span>
          </div>
        )
      case currentStreak >= 10:
        return (
          <div className="badge text-xs">
            <span className="">⚡ {currentStreak} Days</span>
          </div>
        )
      case currentStreak >= 3:
        return (
          <div className="badge text-xs">
            <span className="">🏅 {currentStreak} Days</span>
          </div>
        )
      default:
        return (
          <div className="badge text-xs">
            <span className="">🔥 {currentStreak} Days</span>
          </div>
        )
    }
  }
  return (
    <div className="flex text-xs items-center justify-center">
      {renderBadge()}
    </div>
  )
}

export function Reward({ currentStreak }) {
  const renderReward = () => {
    if (currentStreak >= 30) {
      return {
        message: "🎉 You've unlocked a Gold Badge!",
        icon: <AiOutlineTrophy className="text-yellow-500 text-4xl" />,
      }
    }
    if (currentStreak >= 10) {
      return {
        message: "🔥 You've unlocked a Streak Booster!",
        icon: <BsFire className="text-red-500 text-4xl" />,
      }
    }
    if (currentStreak >= 5) {
      return {
        message: "🏅 You're on a roll! Keep it up!",
        icon: <AiOutlineStar className="text-blue-500 duration-300 text-4xl" />,
      }
    }
    return {
      message: "🌟 Keep checking in to earn rewards!",
      icon: (
        <AiOutlineStar className=" duration-300 text-yellow-500 text-4xl" />
      ),
    }
  }

  const { message, icon } = renderReward()

  return (
    <div className="reward  text-xs bg-white shadow-lg rounded-lg p-6  text-center">
      <div className="flex flex-col  lg:text-lg text-xs  items-center">
        {icon}
        <p className=" lg:text-lg text-sm   font-semibold text-gray-800">
          {message}
        </p>
      </div>
    </div>
  )
}

export function StreakProgress({ currentStreak }) {
  const getDaysInCurrentMonth = () => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  }
  const getDaysInCurrentYear = () => {
    const now = new Date()
    return (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 > 0) ||
      now.getFullYear() % 400 == 0
      ? 366
      : 365
  }

  const goals = {
    days: 30,
    months: getDaysInCurrentMonth(),
    years: getDaysInCurrentYear(),
  }

  const [currentGoal, setCurrentGoal] = useState(goals.days)
  const [progressPercentage, setProgressPercentage] = useState(0)

  useEffect(() => {
    const percentage = Math.min((currentStreak / currentGoal) * 100, 100)
    setProgressPercentage(percentage)
  }, [currentStreak, currentGoal])

  useEffect(() => {
    const updateGoals = () => {
      setCurrentGoal((prevGoal) => {
        if (prevGoal === goals.months) return getDaysInCurrentMonth()
        if (prevGoal === goals.years) return getDaysInCurrentYear()
        return prevGoal
      })
    }

    updateGoals()
    const now = new Date()
    const timeToMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now
    const timerId = setTimeout(() => {
      updateGoals()
      setInterval(updateGoals, 24 * 60 * 60 * 1000)
    }, timeToMidnight)

    return () => {
      clearTimeout(timerId)
      clearInterval(timerId)
    }
  }, [])

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
    <div className="streak-progress mt-6 p-4   rounded-lg ">
      <h2 className="text-lg font-semibold mb-2">Streak Progress</h2>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-500">Goal: {currentGoal} Days</span>
        <span className="text-sm font-bold text-green-600">
          {currentStreak} Days
        </span>
      </div>
      <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-green-500 h-full rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
        <span
          className="absolute top-0 left-0 px-2 text-xs text-white font-semibold transition-transform duration-300"
          style={{ transform: `translateX(${progressPercentage - 10}%)` }}
        >
          {Math.round(progressPercentage)}%
        </span>
      </div>
      <div className="flex justify-between items-center mt-4">
        <select
          value={currentGoal}
          onChange={(e) => setCurrentGoal(Number(e.target.value))}
          className=" outline-none border rounded-md px-2 py-1"
        >
          <option value={goals.days}>30 Days</option>
          <option value={goals.months}>{goals.months} Days (This Month)</option>
          <option value={goals.years}>{goals.years} Days (This Year)</option>
        </select>
        <button
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-xs text-white font-semibold px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out hover:from-purple-600 hover:to-blue-600"
          onClick={share}
        >
          <span>Share</span>
          <Share2 className="w-4 h-4 mr-2" />
        </button>
      </div>
    </div>
  )
}
