
import React from "react"
import UserHeader from "./UserHeader"
import Header from "./Header"
import { useSession } from "next-auth/react"

export default function MainHeader() {
  const { data: session } = useSession()

  return <div className="fixed top-0 z-40 shadow-md dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full">{session ? <UserHeader /> : <Header />}</div>
}
