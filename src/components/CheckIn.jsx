import React, { useEffect, useState } from "react"
import Card, { StreakCard } from "./Card"
import { useCheckIn } from "@/context/CheckInContext"

export default function CheckIn() {
  const { loading, checkIns, error } = useCheckIn()

  return (
    <section className="nav-wrapper mt-20 gap-6 flex flex-col lg:flex-row">
      <div className="flex flex-col w-full lg:w-[70%] space-y-6">
        <div>
          <h1 className="text-xl font-bold mb-4 border-b pb-3">Today</h1>
          <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-4 gap-2">
            {checkIns.todayCheckIns.reverse().map(
              ({
                _id: checkInId,
                userId: { id: userId, name: userName,},
                profilePicture,
                message,
                streak,
              }) => (
                <Card
                  key={checkInId}
                  id={userId}
                  name={userName}
                  profilePicture={profilePicture}
                  message={message}
                  streak={streak}
                />
              )
            )}
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold mb-4 border-b pb-3">Yesterday</h1>
          <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-2">
            {checkIns.yesterdayCheckIns.map(
              ({ id, name, profilePicture, message }) => (
                <Card
                  key={id}
                  name={name}
                  profilePicture={profilePicture}
                  message={message}
                />
              )
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[30%]">
        <h1 className="text-xl font-bold mb-4 border-b pb-3">Streak</h1>
        {checkIns?.allUserStreaks?.map(
          ({ id, name, profilePicture, message, streak }) => (
            <StreakCard
              key={id}
              id={id}
              name={name}
              profilePicture={profilePicture}
              message={message}
              streak={streak}
            />
          )
        )}
      </div>
    </section>
  )
}
