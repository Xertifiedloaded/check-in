import Head from "next/head"
import React, { useEffect } from "react"
import Heading from "@/components/Heading"
import CheckIn from "@/components/CheckIn"
import { useCheckIn } from "@/context/CheckInContext"
import MainHeader from "./MainHeader"
import PageHead from "@/components/PageHead"
import { MessageCircle, RefreshCw } from "lucide-react"
import { trackingComponent } from "@/components/TrackingComponent"

export default function Home() {

  const { loadingCheckIns, error } = useCheckIn()


  if (loadingCheckIns) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-600">Loading Page...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
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
