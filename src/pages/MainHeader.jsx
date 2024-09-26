import { useAuth } from "@/context/AuthContext"
import React from "react"
import UserHeader from "./UserHeader"
import Header from "./Header"
import { useSession } from "next-auth/react"

export default function MainHeader() {
  const { data: session } = useSession()
  console.log(session ? "hello" : "yay")

  return <div>{session ? <UserHeader /> : <Header />}</div>
}
