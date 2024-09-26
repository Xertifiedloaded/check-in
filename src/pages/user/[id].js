import { StreakCard } from "@/components/Card"
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
      <div className="flex flex-col mt-10 nav-wrapper lg:flex-row gap-6 w-full">
        <div className="flex-1 lg:w-[70%] space-y-6">
          {checkIns.length === 0 ? (
            <p className="text-center">No check-ins found for this user.</p>
          ) : (
            checkIn.reverse().map(
              ({
                _id,
                message,
                date,
                userId: { _id: userId, name, profilePicture },
              }) => (
                <div
                  key={_id}
                  className="checkin border rounded-lg shadow-md py-8 px-5 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center justify-start gap-4 mb-3">
                      <Image
                        src={profilePicture || "/no-user.png"}
                        width={200}
                        className="w-[30px] h-[30px] rounded-full"
                        height={200}
                        alt={name}
                      />
                      <p className="capitalize">{name}</p>
                    </div>
                    <div class="flex space-x-2 items-center text-gray-500 dark:text-gray-400">
                      <Image
                        src={"/calender.svg"}
                        width={200}
                        className="w-[20px] h-[20px] rounded-full"
                        height={200}
                        alt={name}
                      />
                      <span class="text-sm">
                        {" "}
                        {new Date(date).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-800">{message}</p>
                </div>
              )
            )
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
