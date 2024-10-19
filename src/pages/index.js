import Head from "next/head"
import Heading from "@/components/Heading"
import CheckIn from "@/components/CheckIn"
import { useCheckIn } from "@/context/CheckInContext"
import MainHeader from "./MainHeader"
import { MessageCircle } from "lucide-react"

export default function Home() {
  const { loadingCheckIns, error } = useCheckIn()

  if (loadingCheckIns) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>DailyCheck-In</title>
        <meta
          name="description"
          content="Stay on track, achieve your goals, and beat procrastination together!, track activities of others and what they are upto daily"
        />
        <meta property="og:title" content="DailyCheck-In" />
        <meta
          property="og:description"
          content="Stay on track and achieve your goals!"
        />
        <meta property="og:image" content="/check.svg" />
        <link rel="canonical" href="https://www.daily-check-in.com.ng" />
        <link rel="icon" href="/check.svg" />
      </Head>
      <main className="mt-28">
        <MainHeader />
        <Heading />
        <CheckIn />
      </main>
    </>
  )
}
