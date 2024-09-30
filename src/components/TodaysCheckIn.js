import React from "react"
import Card, { StreakCard } from "./Card"
import { useCheckIn } from "@/context/CheckInContext"

export default function TodayCheckIn() {
  const { todayPosts } = useCheckIn();
  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-4 gap-2">
      {todayPosts.length > 0 ? (
        todayPosts.map((post) => <Card key={post.id} post={post} />) 
      ) : (
        <div className="col-span-2 text-center">
          <p className="text-gray-500">No check-ins available for today.</p>
        </div>
      )}
    </div>
  );
  
}

export function YesterDayCheckIn() {
  const { yesterdayPosts} = useCheckIn()
  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-4 gap-2">
      {yesterdayPosts.length > 0 ? (
        yesterdayPosts.map((post) => <Card key={post.id} post={post} />) 
      ) : (
        <div className="col-span-2 text-center">
          <p className="text-gray-500">No check-ins available for Yesterday.</p>
        </div>
      )}
    </div>
  )
}





export function UsersStreak() {
  const { loading, checkIns, streaks, error } = useCheckIn()
  return (
    <div className="w-full lg:w-[30%]">
      <h1 className="text-xl font-bold mb-4 border-b pb-3">Streak</h1>
      {streaks.length > 0 ? (
        streaks.map((items) => <StreakCard key={items.id} {...items} />)
      ) : (
        <div className="col-span-2 text-center">
          <p className="text-gray-500">No user streaks available.</p>
        </div>
      )}
    </div>
  )
}
