import Head from "next/head"
import React from "react"
import Heading from "@/components/Heading"
import CheckIn from "@/components/CheckIn"
import { useCheckIn } from "@/context/CheckInContext"
import MainHeader from "./MainHeader"
import PageHead from "@/components/PageHead"

export default function Home() {
  const { loadingCheckIns, error } = useCheckIn()
  if (loadingCheckIns) {
    return (
      <section className="flex justify-center items-center lg:h-screen h-[90vh] ">
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
