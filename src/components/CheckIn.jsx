import React, { useEffect, useState } from "react"
import Card, { StreakCard } from "./Card"
import { useCheckIn } from "@/context/CheckInContext"

export default function CheckIn() {
  const { loading,checkIns,error } = useCheckIn()
  if (loading) {
    return <div>Loading check-ins...</div>
  }

  
  return (
    <section className="nav-wrapper mt-20 gap-6 flex flex-col lg:flex-row">
      <div className="flex flex-col w-full lg:w-[70%] space-y-6">
        <div>
          <h1 className="text-xl font-bold mb-4 border-b pb-3">Today</h1>
          <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-4 gap-2">
            {checkIns.todayCheckIns.map(({ userId, date }) => (
              <Card key={userId._id} name={userId.name} />
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold mb-4 border-b pb-3">Yesterday</h1>
          <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-2">
            {checkIns.yesterdayCheckIns.map(({ userId, date }) => (
              <Card key={userId._id} name={userId.name} />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[30%]">
        <h1 className="text-xl font-bold mb-4 border-b pb-3">Streak</h1>
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <StreakCard key={index} />
          ))}
      </div>
    </section>
  )
}
