import React from "react"
import Card, { StreakCard } from "./Card"
import { useCheckIn } from "@/context/CheckInContext"

export default function TodayCheckIn() {
  const { loading, checkIns, error } = useCheckIn()
  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-4 gap-2">
      {checkIns.todayCheckIns && checkIns.todayCheckIns.length > 0 ? (
        checkIns.todayCheckIns.map(({ id, name, profilePicture, message }) => (
          <Card
            key={id}
            id={id}
            name={name}
            profilePicture={profilePicture}
            message={message}
          />
        ))
      ) : (
        <div className="col-span-2 text-center">
          <p className="text-gray-500">No check-ins available for today.</p>
        </div>
      )}
    </div>
  )
}

export function YesterDayCheckIn() {
  const { loading, checkIns, error } = useCheckIn()
  return (
    <div>
      <h1 className="text-xl font-bold mb-4 border-b pb-3">Yesterday</h1>
      <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-2">
        {checkIns.yesterdayCheckIns && checkIns.yesterdayCheckIns.length > 0 ? (
          checkIns.yesterdayCheckIns.map(
            ({ id, name, profilePicture, message }) => (
              <Card
                key={id}
                id={id}
                name={name}
                profilePicture={profilePicture}
                message={message}
              />
            )
          )
        ) : (
          <div className="col-span-2 text-center">
            <p className="text-gray-500">
              No check-ins available for yesterday.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export function UsersStreak() {
  const { loading, checkIns, streaks, error } = useCheckIn()
  return (
    <div className="w-full lg:w-[30%]">
      <h1 className="text-xl font-bold mb-4 border-b pb-3">Streak</h1>
      {streaks.length > 0 ? (
        streaks.map((items, id) => <StreakCard key={id} {...items} />)
      ) : (
        <div className="col-span-2 text-center">
          <p className="text-gray-500">No user streaks available.</p>
        </div>
      )}
    </div>
  )
}
