"use client"
import React, { useState, useEffect } from "react"
import axios from "axios"

import StreakPage from "../../../components/Streak"
import { useSession } from "next-auth/react"

const UpdateProfileStreak = () => {
  const [currentStreak, setCurrentStreak] = useState(null)
  const [streakEnded, setStreakEnded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { data: session } = useSession()
  const userGoogleAccount = session?.user?.isGoogleAuth
  console.log(userGoogleAccount);
  
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await axios.get("/api/user/currentstreak")
        setCurrentStreak(response.data.currentStreak)
        setStreakEnded(response.data.streakEnded)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch streak")
        setLoading(false)
      }
    }
    fetchStreak()
  }, [])

  return (
    <>

      <div className="mt-4 bg-inherit text-inherit">

        <div className=" py-[20px] sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className=" rounded-lg h-96 mb-6">
              {loading ? (
                <div className="flex items-center shadow-md justify-center h-full">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
                </div>
              ) : error ? (
                <div className="flex items-center  shadow  justify-center h-full text-red-500">
                  {error}
                </div>
              ) : (
                <div className="bg-inherit text-inherit py-5 shadow overflow-hidden sm:rounded-lg mb-6">
                  <StreakPage
                    currentStreak={currentStreak}
                    streakEnded={streakEnded}
                  />
                </div>
              )}
            </div>

  
          </div>
        </div>
      </div>
    </>
  )
}
export default UpdateProfileStreak
