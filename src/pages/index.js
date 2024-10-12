import React, { useEffect, useState } from "react"
import Heading from "@/components/Heading"
import CheckIn from "@/components/CheckIn"
import { useCheckIn } from "@/context/CheckInContext"
import MainHeader from "./MainHeader"
import PageHead from "@/components/PageHead"

export default function Home() {
  const { todayPosts, yesterdayPosts, error } = useCheckIn()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (todayPosts ) {
      setIsLoading(false) 
    }
  }, [todayPosts, yesterdayPosts])


  if (isLoading) {
    return (
      <section className="flex justify-center items-center lg:h-screen h-[90vh]">
        <div className="loader"></div>
      </section>
    )
  }



  return (
    <>
      <PageHead
        content="Stay on track, achieve your goals, and beat procrastination together!"
        title="DailyCheck-In"
      />

      <main className="mt-28">
        <MainHeader />
        <Heading />
        <CheckIn />
      </main>
    </>
  )
}
