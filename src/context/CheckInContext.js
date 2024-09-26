"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

const CheckInContext = createContext()

export const CheckInProvider = ({ children }) => {
  const [checkIns, setCheckIns] = useState({
    todayCheckIns: [],
    yesterdayCheckIns: [],
    allUserStreaks: [],
  })

  const [streaks, setStreaks] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkInLoading, setCheckInLoading] = useState(false)
  const [error, setError] = useState(null)
  const [feed, setFeed] = useState([])

  const FetchFeed = async () => {
    const response = await fetch("/api/feed")
    const data = await response.json()
    const feedData = data.checkIns.map(
      ({
        user: { id: userId, name: userName, profilePicture },
        message,
        date,
      }) => ({
        userId,
        userName,
        profilePicture,
        message,
        date,
      })
    )
    console.log(feedData)

    setFeed(feedData)
  }

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
          userId: {
            id: checkIn.userId._id,
            name: checkIn.userId.name,
          },
          name: checkIn.user.name,
          profilePicture: checkIn.user.profilePicture,
          message: checkIn.message,
          date: checkIn.date,
          streak: checkIn.streak,
          lastCheckInDate: checkIn.lastCheckInDate,
        })),
        allUserStreaks: data.allUserStreaks || [],
      })
    } catch (err) {
      console.error("Error fetching check-ins:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const postCheckIn = async (message) => {
    const toastId = toast.loading("Uploading, please wait...")
    try {
      setCheckInLoading(true)
      const response = await fetch("/api/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      const data = await response.json()
      if (!response.ok) {
        setCheckInLoading(false)
        toast.error(data.message, { toastId })
        return
      }

      toast.success(data.message, { toastId })
      setCheckInLoading(false)
      fetchCheckIns()
      FetchFeed()
    } catch (error) {
      setCheckInLoading(false)
      console.error("Error posting check-in:", error)
      toast.error("An error occurred while posting your check-in.", { toastId })
      alert("An error occurred while posting your check-in.")
    }
  }

  useEffect(() => {
    FetchFeed()
    fetchCheckIns()
  }, [])

  return (
    <CheckInContext.Provider
      value={{
        checkIns,
        loading,
        error,
        FetchFeed,
        feed,
        postCheckIn,
        checkInLoading,
      }}
    >
      {children}
    </CheckInContext.Provider>
  )
}

export const useCheckIn = () => {
  return useContext(CheckInContext)
}
