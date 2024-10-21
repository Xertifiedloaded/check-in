"use client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import MainHeader from "../MainHeader"
import { FeedUserCard } from "@/components/UserFeedCard"
import { ArrowLeft, MessageCircle, RefreshCcw } from "lucide-react"
import Head from "next/head"
import Link from "next/link"

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
      console.log(data.posts)
      console.log("Check-ins data:", data)

      setCheckIns(data.posts)
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title className="">Daily Check-in</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta
          name="description"
          content="Catch up with user and see their latest check-ins, activities, and shared experiences from around the world."
        />
      </Head>

      <MainHeader />
      <main className="max-w-4xl pt-24 mx-auto ">
        <div className="flex items-center mb-6">
          <Link
            href="/feed"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
        <div className="mb-4 px-4 ">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Checkin
              </h1>
              <p className="text-gray-600 text-xs lg:text-base mt-1">
                Stay updated with what others are doing
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 mt-4 sm:mt-0">
              {checkIn.length > 0 && (
                <div className=" text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-sm">
                    {checkIn.length} {checkIn.length === 1 ? "post" : "checkIn"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {checkIn.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              No Posts Yet
            </h3>
            <p className="text-gray-600 mt-2">
              Be the first to share your progress!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {checkIn.map((post) => (
              <div
                key={post.id}
                className="bg-white shadow-lg rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <FeedUserCard post={post} comments={post.comments} />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default CheckInList
