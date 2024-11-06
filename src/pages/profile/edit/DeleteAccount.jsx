'use client'
import React from "react"
import UpdateHeading from "./UpdateHeading"
import Button from "../../../components/Buttons"
import axios from "axios"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"

export default function DeleteAccount() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleDeleteUser = async (e) => {
    e.preventDefault()
    if (
      confirm(
        "Are you sure you want to delete this account? This action cannot be undone."
      )
    ) {
      try {
        const response = await axios.delete(`/api/admin/delete-account?userId=${session?.user?.id}`)
        alert("Account deleted successfully!")
        await signOut()
        router.push("/")
      } catch (error) {
        console.error("Error deleting account:", error)
        alert("Failed to delete account.")
      }
    }
  }

  return (
    <form onSubmit={handleDeleteUser} className="shadow-md border p-6 rounded-md">
      <UpdateHeading
        heading="Delete Account"
        paragraph="After deleting your account, all data and resources are permanently removed. Enter your password to confirm deletion."
      />
      <Button
        type="submit"
        className="bg-bgColorRed py-2 px-3 rounded-[25px] mt-4 text-white text-sm"
        value="Delete Account"
      />
    </form>
  )
}
