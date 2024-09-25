import React, { useEffect, useState } from "react"
import Button from "./Buttons"
import { useCheckIn } from "@/context/CheckInContext"
import { toast } from "react-toastify"
import { useAuth } from "@/context/AuthContext"

export default function Heading() {
  const [message, setMessage] = useState("")
  
  const { postCheckIn, checkInLoading } = useCheckIn()
  const { user } = useAuth()
  const userId = user && user._id
  const handleFocus = () => {
    if (!userId) {
      toast.error("You need to log in to check in.")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) {
      alert("Please enter a message before checking in.")
      return
    }
    if (!userId) {
      toast.error("You need to log in to check in.")
      return
    }
    postCheckIn(userId, message)
    setMessage("")
  }

  return (
    <section className="nav-wrapper grid justify-items-center">
      <div>
        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-center text-slate-800 sm:text-5xl md:text-7xl">
          Daily Check-In
        </h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="working" className="w-full">
            <p className="mt-10 mb-3 text-center text-sm text-slate-500">
              Stay on track, achieve your goals, and beat procrastination together!
            </p>
            <textarea
              className={`resize-none border-2 outline-none block w-full placeholder:text-xs shadow-sm h-[120px] p-4 rounded-lg border-gray-200 ${!userId ? ' cursor-not-allowed' : ''}`}
              id="working"
              placeholder={userId ? "What are you working on today?" : "Log in to enable check-in."}
              value={message}
              onChange={(e) => userId && setMessage(e.target.value)} 
              onFocus={handleFocus}
            ></textarea>
          </label>
          <div className="text-center mt-10">
            <Button
              type="submit"
              className="bg-blue-700 px-24 text-sm ring-4 py-4 font-medium rounded-[25px] text-white"
              value={checkInLoading ? "Posting..." : "Check-In"}
              disabled={!userId} 
            />
          </div>
        </form>
      </div>
    </section>
  )
}
