
import React from "react"
import UserHeader from "./UserHeader"
import Header from "./Header"
import { useSession } from "next-auth/react"

export default function MainHeader() {
  const { data: session } = useSession()

  return <div>{session ? <UserHeader /> : <Header />}</div>
}
