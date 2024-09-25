"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

const CheckInContext = createContext()

export const CheckInProvider = ({ children }) => {
  const [checkIns, setCheckIns] = useState({
    todayCheckIns: [],
    yesterdayCheckIns: [],
  })

  const [streaks, setStreaks] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkInLoading, setCheckInLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCheckIns = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/check-in")
      if (!response.ok) {
        throw new Error("Failed to fetch check-ins")
      }
      const data = await response.json()
      setCheckIns({
        todayCheckIns: data.todayCheckIns.map((checkIn) => ({
          id: checkIn.id,
          userId: {
            id: checkIn.userId._id,
            name: checkIn.userId.name,
          },
          name: checkIn.user?.name,
          profilePicture: checkIn.user?.profilePicture,
          message: checkIn.message,
          date: checkIn.date,
          streak: checkIn.streak,
          lastCheckInDate: checkIn.lastCheckInDate,
        })),
        yesterdayCheckIns: data.yesterdayCheckIns.map((checkIn) => ({
          id: checkIn._id,
          name: checkIn.user.name,
          profilePicture: checkIn.user.profilePicture,
          message: checkIn.message,
          date: checkIn.date,
          streak: checkIn.streak,
          lastCheckInDate: checkIn.lastCheckInDate,
        })),
      })
    } catch (err) {
      console.error("Error fetching check-ins:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const postCheckIn = async (userId, message) => {
    try {
      setCheckInLoading(true)
      const response = await fetch("/api/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, message }),
      })
      const data = await response.json()
      if (!response.ok) {
        setCheckInLoading(false)
        toast.error(data.message)
      }
      toast.success(data.message)
      setCheckInLoading(false)
      fetchCheckIns()
    } catch (error) {
      setCheckInLoading(false)
      console.error("Error posting check-in:", error)
      toast.error("An error occurred while posting your check-in.")
      alert("An error occurred while posting your check-in.")
    }
  }

  useEffect(() => {
    fetchCheckIns()
  }, [])

  return (
    <CheckInContext.Provider
      value={{ checkIns, loading, error, postCheckIn, checkInLoading }}
    >
      {children}
    </CheckInContext.Provider>
  )
}

export const useCheckIn = () => {
  return useContext(CheckInContext)
}
