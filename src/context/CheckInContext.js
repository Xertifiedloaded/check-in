"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

const CheckInContext = createContext()

export const CheckInProvider = ({ children }) => {
  const [checkIns, setCheckIns] = useState({
    todayCheckIns: [],
    yesterdayCheckIns: [],
  })

  const [loading, setLoading] = useState(true)
  const [checkInLoading, setCheckInLoading] = useState(false)
  const [error, setError] = useState(null)
  const [feed, setFeed] = useState([])
  const [streaks, setStreaks] = useState([]);









  const fetchCheckIns = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/latest-checkin");
      if (!response.ok) {
        throw new Error("Failed to fetch check-ins");
      }
      const data = await response.json();
  
      setCheckIns({
        todayCheckIns: data.today,
        yesterdayCheckIns: data.yesterday,
      });
  
      console.log(data); 
  
    } catch (err) {
      console.error("Error fetching check-ins:", err);

    } finally {
      setLoading(false);
    }
  };
  

  const fetchStreaks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/streak"); 
      if (!response.ok) {
        throw new Error("Failed to fetch ongoing streaks");
      }
      const data = await response.json();
      setStreaks(data.streaks); 
    } catch (err) {
      console.error("Error fetching streaks:", err);
    } finally {
      setLoading(false);
    }
  };






  const postCheckIn = async (message) => {
    setCheckInLoading(true)
    const toastId = toast.loading("Posting check-in...")

    try {
      const response = await fetch("/api/post-checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      const data = await response.json()

      if (!response.ok) {
        setCheckInLoading(false)
        toast.update(toastId, {
          render: "Error: error posting",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        })
        return
      }

      toast.update(toastId, {
        render: "Success! " + data.message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      })

      fetchCheckIns()
      fetchStreaks()
    } catch (error) {
      setCheckInLoading(false)
      toast.update(toastId, {
        render: "Network error: " + error.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      })
      console.error("Error posting check-in:", error)
    } finally {
      setCheckInLoading(false)
    }
  }

  useEffect(() => {
    fetchCheckIns()
    fetchStreaks()
  }, [])

  return (
    <CheckInContext.Provider
      value={{
        checkIns,
        loading,
        error,
        feed,
        streaks,
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
