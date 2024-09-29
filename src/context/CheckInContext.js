"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

const CheckInContext = createContext()

export const CheckInProvider = ({ children }) => {
  const [todayPosts, setTodayPosts] = useState([])
  const [yesterdayPosts, setYesterdayPosts] = useState([])

  const [loading, setLoading] = useState(true)
  const [checkInLoading, setCheckInLoading] = useState(false)
  const [error, setError] = useState(null)
  const [feed, setFeed] = useState([])
  const [streaks, setStreaks] = useState([])

  const fetchCheckIns = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/post/today-yesterday");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
    
      if (!Array.isArray(data)) {
        console.error("Expected an array but got:", data);
        setLoading(false);
        return; 
      }
      
      const today = new Date().setHours(0, 0, 0, 0);
      const yesterday = new Date(today).setDate(new Date(today).getDate() - 1);
      
      const todayFiltered = data.filter((post) => {
        const postDate = new Date(post.createdAt).setHours(0, 0, 0, 0);
        return postDate === today;
      });
      
      const yesterdayFiltered = data.filter((post) => {
        const postDate = new Date(post.createdAt).setHours(0, 0, 0, 0);
        return postDate === yesterday;
      });
      
      setTodayPosts(todayFiltered);
      setYesterdayPosts(yesterdayFiltered);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  


  
  const fetchStreaks = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/post/streak")
      if (!response.ok) {
        throw new Error("Failed to fetch ongoing streaks")
      }
      const data = await response.json()

      setStreaks(data)
    } catch (err) {
      console.error("Error fetching streaks:", err)
    } finally {
      setLoading(false)
    }
  }

  const postCheckIn = async (content, userId) => {
    setCheckInLoading(true)
    const toastId = toast.loading("Posting check-in...")

    try {
      const response = await fetch("/api/post/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, userId }),
      })

      const data = await response.json()
      console.log(data)

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
        render: data.message,
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
        todayPosts,
        yesterdayPosts,
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
