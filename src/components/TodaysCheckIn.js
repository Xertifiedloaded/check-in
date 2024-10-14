"use client"
import React from "react"
import Card, { StreakCard } from "./Card"
import { useCheckIn } from "@/context/CheckInContext"

export default function TodayCheckIn() {
  const { todayPosts } = useCheckIn()
  console.log(todayPosts)

  return (
    <section>
      <h1 className="text-xl font-semibold">Today</h1>
      <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-4 gap-2">
        {todayPosts.length > 0 ? (
          todayPosts.map((post) => <Card key={post.id} post={post} />)
        ) : (
          <div className="col-span-2 text-center">
            <p className="text-gray-500">No check-ins available for today.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export function YesterDayCheckIn() {
  const { yesterdayPosts } = useCheckIn()
  return (
    <section>
      <h1 className="text-xl font-semibold">Yesterday</h1>
      <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-4 gap-2">
        {yesterdayPosts.length > 0 ? (
          yesterdayPosts.map((post) => <Card key={post.id} post={post} />)
        ) : (
          <div className="col-span-2 text-center">
            <p className="text-gray-500">
              No check-ins available for Yesterday.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export  function UsersStreak() {
  const {  streaks } = useCheckIn();
  return (
    <div className="w-full sticky top-0 lg:w-[30%]">
      <h2 className="text-xl font-bold mb-4 border-b pb-3">Streak</h2>
      {streaks.length > 0 ? (
        streaks.map((streak) => <StreakCard key={streak.id} {...streak} />)
      ) : (
        <div className="text-center">
          <p className="text-gray-500">No user streaks available.</p>
        </div>
      )}
    </div>
  );
}
