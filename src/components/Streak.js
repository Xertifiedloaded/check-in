"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { Reward, StreakProgress } from "./Card"

export default function StreakPage() {
  const [currentStreak, setCurrentStreak] = useState(null)
  const [streakEnded, setStreakEnded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await axios.get("/api/user/currentstreak")
        console.log(response);
        
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

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="streak-page">
      <h1 className="md:text-2xl text-lg font-bold text-center">Your Current Streak</h1>
      <p className="text-center text-gray-600 mt-2">
        {streakEnded ? (
          "Your streak has ended. Start a new streak!"
        ) : currentStreak === 0 ? (
          "No streak yet, start your first check-in!"
        ) : (
          `${currentStreak} Day${currentStreak > 1 ? "s" : ""}`
        )}
      </p>
      {currentStreak > 0 && !streakEnded && (
        <>
          <Reward currentStreak={currentStreak} />
          <StreakProgress currentStreak={currentStreak} />
        </>
      )}
    </div>
  )
}
