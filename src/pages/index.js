import Head from "next/head"
import React from "react"
import Heading from "@/components/Heading"
import CheckIn from "@/components/CheckIn"
import { useAuth } from "@/context/AuthContext"

export default function Home() {
  const {user}=useAuth()
  const userId = user?._id
  
  return (
    <>
      <Head>
        <title>DailyCheck-In</title>
        <meta
          name="description"
          content="Department Of Animal Breeding And Genetics"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </Head>
      <main>
        <Heading userId={userId} />
        <CheckIn />
      </main>
    </>
  )
}
