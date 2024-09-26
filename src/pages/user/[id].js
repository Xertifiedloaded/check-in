import { FeedUserCard, StreakCard } from "@/components/Card"
import { useCheckIn } from "@/context/CheckInContext"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Image from "next/image"
import MainHeader from "../MainHeader"
const CheckInList = () => {
  const router = useRouter()
  const { id } = router.query
  const [checkIn, setCheckIns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { checkIns } = useCheckIn()

  const fetchCheckIns = async () => {
    if (!id) return

    setLoading(true)
    try {
      const response = await fetch(`/api/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch check-ins")
      }
      const data = await response.json()

      console.log("Check-ins data:", data)

      setCheckIns(data.checkIns || [])
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
          {checkIns.length === 0 ? (
            <p className="text-center">No check-ins found for this user.</p>
          ) : (
            checkIn.reverse().map((items) => <FeedUserCard {...items} />)
          )}
        </div>

        <div className="w-full lg:w-[30%]">
          <h1 className="text-xl font-bold mb-4 border-b pb-3">Streak</h1>
          {checkIns.todayCheckIns?.map(
            ({ id, name, profilePicture, message, streak }) => (
              <StreakCard
                key={id}
                id={id}
                name={name}
                profilePicture={profilePicture}
                message={message}
                streak={streak}
              />
            )
          )}
        </div>
      </div>
    </>
  )
}

export default CheckInList
