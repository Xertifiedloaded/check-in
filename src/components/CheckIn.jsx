import React, { useEffect, useState } from "react"

import TodayCheckIn, { UsersStreak } from "./TodaysCheckIn"

export default function CheckIn() {


  return (
    <section className="nav-wrapper mt-20 gap-6 flex flex-col lg:flex-row">
      <div className="flex flex-col w-full lg:w-[70%] space-y-6">
        <TodayCheckIn />
      </div>
      <UsersStreak />
    </section>
  )
}
