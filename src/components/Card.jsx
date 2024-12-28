"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Share2 } from "lucide-react";
import useLikeStatus from "../utils/actions";
import { useEffect, useState } from "react";
import { AiOutlineStar, AiOutlineTrophy } from "react-icons/ai";
import { BsFire } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";


export const CardComponent = ({ post }) => {
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const user = post.user || {};
  const { isLiked, toggleLike, loading, count } = useLikeStatus(
    user.id,
    post.id
  );

  const handleToggleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleLike();
  };

  const truncateContent = (content) => {
    const text = content || "";
    const width = window.innerWidth;
    const length = width <= 768 ? 40 : 25;
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  return (
    <>
      <Card className="bg-white dark:bg-black relative rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 mb-3">
        
        <CardHeader>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link
                href={`/information/${user?.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center space-x-3 group"
              >
                <div className="relative">
                  <Image
                    src={user?.profilePicture ?? "/no-user-pic.png"}
                    width={40}
                    height={40}
                    className="rounded-full w-10 h-10 object-cover ring-2 ring-gray-50 dark:ring-gray-700"
                    alt={user.name || "User"}
                  />
                  {post?.currentStreak > 1 && (
                    <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center">
                      <span className="mr-0.5">🔥</span>
                      {post?.currentStreak}
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-1">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {user?.name?.split(" ")[0] ?? "Unknown User"}
                    </h2>
                    {user?.isVerified && (
                      <svg
                        className="w-3 h-3 text-blue-500 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                      </svg>
                    )}
                    {user?.isOwner && (
                      <Image
                        src="/check.svg"
                        width={20}
                        height={20}
                        className="w-3 h-3 dark:invert object-cover"
                        alt={user.name || "User"}
                      />
                    )}
                  </div>
                  <p className="lg:text-[9px] text-xs text-gray-500 dark:text-gray-400">
                    {post?.createdAt &&
                    !isNaN(new Date(post.createdAt).getTime())
                      ? formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })
                      : "Just now"}
                  </p>
                </div>
              </Link>
            </HoverCardTrigger>

          </HoverCard>


            <button
              onClick={handleToggleLike}
              disabled={loading}
              className={`flex absolute right-0 top-0 items-center gap-1.5 px-3 py-1.5 rounded-full transition-all`}
            >
              <div
                className={`
          relative p-2 rounded-xl
          ${
            isLiked
              ? "bg-rose-50 dark:bg-rose-500/20"
              : "bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50"
          }
          transition-all duration-300
        `}
              >
                <Heart
                  className={`
            h-3 w-3 transition-all duration-300
              ${
                isLiked
                  ? "text-rose-500 dark:text-rose-400 scale-110 fill-current"
                  : "text-gray-600 dark:text-gray-300 group-hover:scale-110"
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
              <span
                className={`
          text-sm font-medium transition-colors
          ${
            isLiked
              ? "text-rose-500 dark:text-rose-400"
              : "text-gray-700 dark:text-gray-200"
          }
        `}
              >
                {count}
              </span>
            </button>

        </CardHeader>

        {post.imageUrl && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl">
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsImageOpen(true);
              }}
              className="cursor-zoom-in w-full h-full"
            >
              <Image
                src={post?.imageUrl}
                alt={`Post image for ${user.name}`}
                fill
                className="object-cover transition-transform hover:scale-[1.02]"
                priority
              />
            </div>
          </div>
        )}

        <CardContent>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link
                href={`/checkin/${user.id}`}
                onClick={(e) => e.stopPropagation()}
                className="block  dark:hover:bg-gray-700 transition-colors"
              >
                <p className="text-sm pt-1 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {truncateContent(post.content)}
                </p>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.profilePicture ?? "/no-user-pic.png"}
                    />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {post?.createdAt &&
                      !isNaN(new Date(post.createdAt).getTime())
                        ? formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                          })
                        : "Just now"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {post.content}
                </p>
                {post?.imageUrl && (
                  <div className="relative h-32 w-full rounded-md overflow-hidden">
                    <Image
                      src={post?.imageUrl}
                      alt={`Post image for ${user.name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Heart size={14} /> {count} likes
                  </div>
                  {post.commentsCount && (
                    <div className="flex items-center gap-1">
                      <MessageCircle size={14} /> {post.commentsCount} comments
                    </div>
                  )}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </CardContent>
      </Card>

      <Dialog
        open={isImageOpen}
        onOpenChange={(open) => {
          setIsImageOpen(open);
        }}
      >
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] w-auto p-0 bg-transparent border-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full flex items-center justify-center bg-black/80">
            {isImageLoading && (
              <div className="absolute inset-0 flex justify-center items-center text-white z-10">
                <span>Loading...</span>
              </div>
            )}

            <Image
              src={post?.imageUrl}
              alt={`Post image for ${user.name}`}
              width={1920}
              height={1080}
              className="object-contain max-h-[90vh] max-w-[90vw]"
              priority
              onLoadingComplete={() => setIsImageLoading(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export function StreakCard({ userName, userProfilePicture, currentStreak }) {
  const getBadgeClasses = (streak) => {
    if (streak >= 200) {
      return "bg-purple-600 text-white"; // Legend
    } else if (streak >= 150) {
      return "bg-yellow-500 text-white"; // Master
    } else if (streak >= 100) {
      return "bg-green-600 text-white"; // Champion
    } else if (streak >= 75) {
      return "bg-blue-600 text-white"; // Diamond
    } else if (streak >= 50) {
      return "bg-indigo-600 text-white"; // Sapphire
    } else if (streak >= 30) {
      return "bg-yellow-400 text-white"; // Gold
    } else if (streak >= 20) {
      return "bg-gray-400 text-white"; // Silver
    } else if (streak >= 10) {
      return "bg-orange-400 text-white"; // Bronze
    } else if (streak >= 5) {
      return "bg-teal-400 text-white"; // Starter
    } else if (streak >= 1) {
      return "bg-red-400 text-white"; // Beginner
    } else {
      return "bg-gray-100 text-gray-500"; // Default for no streak
    }
  };

  return (
    <div className="flex mb-2 items-center justify-between p-4 bg-white dark:bg-black dark:border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3">
        <Image
          src={userProfilePicture || "/no-user.png"}
          width={40}
          height={40}
          className="rounded-full w-[30px] h-[30px] object-cover border border-gray-200 dark:border-gray-700"
          alt={userName || "User profile picture"}
        />
        <div>
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">
            {userName?.split(" ")[0] ?? "Unknown User"}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {currentStreak > 1
              ? `${currentStreak} days streak`
              : currentStreak === 1
              ? `${currentStreak} day streak`
              : "No current streak"}
          </p>
        </div>
      </div>
      <div
        className={`flex text-sm items-center space-x-1 rounded-full px-3 py-1 ${getBadgeClasses(
          currentStreak
        )}`}
      >
        <StreakBadge currentStreak={currentStreak} />
      </div>
    </div>
  );
}

export function StreakBadge({ currentStreak }) {
  const renderBadge = () => {
    const streakText = currentStreak === 1 ? "Day" : "Days";

    switch (true) {
      case currentStreak >= 200:
        return (
          <div className="badge text-xs">
            <span>💥 Legend</span>
          </div>
        );
      case currentStreak >= 150:
        return (
          <div className="badge text-xs">
            <span>🌟 Master</span>
          </div>
        );
      case currentStreak >= 100:
        return (
          <div className="badge text-xs">
            <span>🏆 Champion</span>
          </div>
        );
      case currentStreak >= 75:
        return (
          <div className="badge text-xs">
            <span>💎 Diamond</span>
          </div>
        );
      case currentStreak >= 50:
        return (
          <div className="badge text-xs">
            <span>🔷 Sapphire</span>
          </div>
        );
      case currentStreak >= 30:
        return (
          <div className="badge text-xs">
            <span>🌟 Gold</span>
          </div>
        );
      case currentStreak >= 20:
        return (
          <div className="badge text-xs">
            <span>🎖️ Silver</span>
          </div>
        );
      case currentStreak >= 10:
        return (
          <div className="badge text-xs">
            <span>⚡ Bronze</span>
          </div>
        );
      case currentStreak >= 5:
        return (
          <div className="badge text-xs">
            <span>🌈 Starter</span>
          </div>
        );
      case currentStreak >= 1:
        return (
          <div className="badge text-xs">
            <span>🏅 Beginner</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex text-xs items-center justify-center">
      {renderBadge()}
    </div>
  );
}

export function Reward({ currentStreak }) {
  const renderReward = () => {
    if (currentStreak >= 30) {
      return {
        message: "🎉 You've unlocked a Gold Badge!",
        icon: <AiOutlineTrophy className="text-yellow-500 text-4xl" />,
      };
    }
    if (currentStreak >= 10) {
      return {
        message: "🔥 You've unlocked a Streak Booster!",
        icon: <BsFire className="text-red-500 text-4xl" />,
      };
    }
    if (currentStreak >= 5) {
      return {
        message: "🏅 You're on a roll! Keep it up!",
        icon: <AiOutlineStar className="text-blue-500 duration-300 text-4xl" />,
      };
    }
    return {
      message: "🌟 Keep checking in to earn rewards!",
      icon: (
        <AiOutlineStar className=" duration-300 text-yellow-500 text-4xl" />
      ),
    };
  };

  const { message, icon } = renderReward();

  return (
    <div className="reward text-xs bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center">
      <div className="flex flex-col lg:text-lg text-xs items-center">
        {icon}
        <p className="lg:text-lg text-sm font-semibold text-gray-800 dark:text-gray-200">
          {message}
        </p>
      </div>
    </div>
  );
}

export function StreakProgress({ currentStreak }) {
  const getDaysInCurrentMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };
  const getDaysInCurrentYear = () => {
    const now = new Date();
    return (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 > 0) ||
      now.getFullYear() % 400 == 0
      ? 366
      : 365;
  };

  const goals = {
    days: 30,
    months: getDaysInCurrentMonth(),
    years: getDaysInCurrentYear(),
  };

  const [currentGoal, setCurrentGoal] = useState(goals.days);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const percentage = Math.min((currentStreak / currentGoal) * 100, 100);
    setProgressPercentage(percentage);
  }, [currentStreak, currentGoal]);

  useEffect(() => {
    const updateGoals = () => {
      setCurrentGoal((prevGoal) => {
        if (prevGoal === goals.months) return getDaysInCurrentMonth();
        if (prevGoal === goals.years) return getDaysInCurrentYear();
        return prevGoal;
      });
    };

    updateGoals();
    const now = new Date();
    const timeToMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
    const timerId = setTimeout(() => {
      updateGoals();
      setInterval(updateGoals, 24 * 60 * 60 * 1000);
    }, timeToMidnight);

    return () => {
      clearTimeout(timerId);
      clearInterval(timerId);
    };
  }, []);

  const share = () => {
    const shareText = `I've maintained a ${currentStreak}-day streak! Check it out!`;
    if (navigator.share) {
      navigator
        .share({
          title: "My Streak Achievement",
          text: shareText,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully!"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  return (
    <div className="streak-progress mt-6 p-4 rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        Streak Progress
      </h2>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Goal: {currentGoal} Days
        </span>
        <span className="text-sm font-bold text-green-600 dark:text-green-400">
          {currentStreak} Days
        </span>
      </div>
      <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
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
          className="outline-none border text-black rounded-md px-2 py-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
  );
}
