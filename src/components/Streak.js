"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { Reward, StreakProgress } from "./Card"
import { useSession } from "next-auth/react"

export default function StreakPage() {
  const [currentStreak, setCurrentStreak] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { data: session } = useSession()
  const userId = session?.user?.id
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await axios.get(`/api/user/currentstreak`, {
          params: userId,
        })
        setCurrentStreak(response.data.currentStreak)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch streak")
        setLoading(false)
      }
    }
    fetchStreak()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="streak-page">
      <h1 className="md:text-2xl text-lg font-bold text-center">
        Your Current Streak
      </h1>
      <p className="text-center text-gray-600 mt-2">
        {currentStreak} Day{currentStreak > 1 && "s"}
      </p>
      <Reward currentStreak={currentStreak} />
      <StreakProgress currentStreak={currentStreak} />
    </div>
  )
}
