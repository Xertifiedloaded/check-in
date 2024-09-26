import React, { useEffect, useState } from "react"
import Button from "./Buttons"
import { useCheckIn } from "@/context/CheckInContext"
import { toast } from "react-toastify"
import { useAuth } from "@/context/AuthContext"
import { useSession } from "next-auth/react"

export default function Heading() {
  const [message, setMessage] = useState("")
  const { data: session } = useSession()
  const { postCheckIn } = useCheckIn()

  const userId = session?.user?.id || session?.user?.googleId
  console.log(userId)

  const handleFocus = () => {
    if (!userId) {
      toast.warning("You need to log in to check in.")
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const toastId = toast.loading("Posting, please wait...")
    if (!message.trim()) {
      toast.warning("You need to log in to check in.")
      return
    }
    if (!userId) {
      toast.error("You need to log in to check in.")
      return
    }
    postCheckIn(message, toastId)
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
            <p className="lg:mt-10 my-6 lg:mb-3 text-center text-xs  md:text-sm text-slate-500">
              Stay on track, achieve your goals, and beat procrastination
              together!
            </p>
            <textarea
              className={`resize-none border-2 outline-none block w-full placeholder:text-xs shadow-sm h-[120px] p-4 rounded-lg border-gray-200 ${
                !userId ? " cursor-not-allowed" : ""
              }`}
              id="working"
              placeholder={
                userId
                  ? "What are you working on today?"
                  : "Log in to enable check-in."
              }
              value={message}
              onChange={(e) => userId && setMessage(e.target.value)}
              onFocus={handleFocus}
            ></textarea>
          </label>
          <div className="text-center mt-10">
            <Button
              type="submit"
              className="bg-blue-700 px-24 text-sm ring-4 py-4 font-medium rounded-[25px] text-white"
              value="Check-In"
              disabled={!userId}
            />
          </div>
        </form>
      </div>
    </section>
  )
}
