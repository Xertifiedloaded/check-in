import { useAuth } from "@/context/AuthContext"
import React from "react"
import UserHeader from "./UserHeader"
import Header from "./Header"


export default function MainHeader() {
  const { user } = useAuth()
  return <div>{user ? <UserHeader  /> : <Header />}</div>
}
