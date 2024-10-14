"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { Reward, ShareStreak, StreakProgress } from "./Card"

export default function StreakPage() {
  const [currentStreak, setCurrentStreak] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await axios.get("/api/user/currentstreak")
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
      <h1 className="text-2xl font-bold text-center">Your Current Streak</h1>
      <p className="text-center text-gray-600 mt-2">
        {currentStreak} Day{currentStreak > 1 && "s"}
      </p>
      <Reward currentStreak={currentStreak} />
      <StreakProgress currentStreak={currentStreak} />
      <ShareStreak currentStreak={currentStreak} />
    </div>
  )
}
