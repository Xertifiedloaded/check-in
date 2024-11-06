"use client"
import React, { useState, useEffect } from "react"
import axios from "axios"
import DeleteAccount from "./DeleteAccount"
import ProfileHeader from "./ProfileHeader"
import ProfileInfo from "./ProfileInfo"
import UpdatePassword from "./UpdatePassword"

import StreakPage from "../../../components/Streak"
import ProtectedRoute from "../../../hooks/ProtectedRoute"
import { useSession } from "next-auth/react"

const UpdateProfile = () => {
  const [currentStreak, setCurrentStreak] = useState(null)
  const [streakEnded, setStreakEnded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { data: session } = useSession()
  const userGoogleAccount = session?.user?.isGoogleAuth
  console.log(userGoogleAccount);
  
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const response = await axios.get("/api/user/currentstreak")
        setCurrentStreak(response.data.currentStreak)
        setStreakEnded(response.data.streakEnded)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch streak")
        setLoading(false)
      }
    }
    fetchStreak()
  }, [])

  return (
    <>

      <div className="min-h-screen bg-gray-100">
        <ProfileHeader />

        <div className="max-w-7xl mx-auto py-[20px] sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className=" rounded-lg h-96 mb-6">
              {loading ? (
                <div className="flex items-center shadow bg-white justify-center h-full">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>
              ) : error ? (
                <div className="flex items-center  shadow bg-white justify-center h-full text-red-500">
                  {error}
                </div>
              ) : (
                <div className="bg-white py-5 shadow overflow-hidden sm:rounded-lg mb-6">
                  <StreakPage
                    currentStreak={currentStreak}
                    streakEnded={streakEnded}
                  />
                </div>
              )}
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Profile Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Personal details and application.
                </p>
              </div>
              <div className="border-t border-gray-200">
                <ProfileInfo />
              </div>
            </div>

            {userGoogleAccount ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Update Password
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Ensure your account is using a long, random password to stay
                    secure.
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <UpdatePassword />
                </div>
              </div>
            ) : null}

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Delete Account
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Permanently remove your account and all of its contents from
                  the platform. This action is not reversible, so please
                  continue with caution.
                </p>
              </div>
              <div className="border-t border-gray-200">
                <DeleteAccount />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default ProtectedRoute(UpdateProfile)
