
import React from "react"
import UserHeader from "./UserHeader"
import Header from "./Header"
import { useSession } from "next-auth/react"

export default function MainHeader() {
  const { data: session } = useSession()

  return <div className="fixed top-0 z-50 shadow-md bg-white w-full">{session ? <UserHeader /> : <Header />}</div>
}
