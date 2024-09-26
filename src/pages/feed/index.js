import { FeedDataCard, StreakCard } from "@/components/Card"
import { useCheckIn } from "@/context/CheckInContext"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import MainHeader from "../MainHeader"
const FeedPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [checkIn, setCheckIns] = useState([])
  const [loading, setLoading] = useState(false)

  const { checkIns, feed } = useCheckIn()

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
          {feed.length === 0 ? (
            <p>No Feed available.</p>
          ) : (
            feed.reverse().map((items) => <FeedDataCard {...items} />)
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

export default FeedPage
