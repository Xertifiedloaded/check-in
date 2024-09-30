"use client";
import { useCheckIn } from "@/context/CheckInContext"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import MainHeader from "../MainHeader"
import { FeedUserCard } from "@/components/UserFeedCard";

const CheckInList = () => {
  const router = useRouter()
  const { id } = router.query
  const [checkIn, setCheckIns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCheckIns = async () => {
    if (!id) return

    setLoading(true)
    try {
      const response = await fetch(`/api/post/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch check-ins")
      }
      const data = await response.json()

      console.log("Check-ins data:", data)

      setCheckIns(data)
    } catch (err) {
      console.error("Error fetching check-ins:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCheckIns()
  }, [id])

  if (loading) {
    return (
      <section className="flex justify-center items-center lg:h-screen h-[90vh] ">
        <div className="loader"></div>
      </section>
    )
  }

  return (
    <>
      <MainHeader />
      <div className="flex flex-col mt-28 nav-wrapper lg:flex-row gap-6 w-full">
        <div className="flex-1 lg:w-[70%] space-y-6">
          {checkIn.length === 0 ? (
            <p className="text-center">No check-ins found for this user.</p>
          ) : (
            checkIn.map((post) => <FeedUserCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </>
  )
}

export default CheckInList
