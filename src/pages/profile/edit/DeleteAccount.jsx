'use client'
import React from "react"
import UpdateHeading from "./UpdateHeading"
import Button from "@/components/Buttons"
import axios from "axios"

export default function DeleteAccount() {
  const handleDeleteUser = async (e) => {
    e.preventDefault()
    if (
      confirm(
        "Are you sure you want to delete this account? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(`/api/user/${userId}`)
        alert("Account deleted successfully!")
      } catch (error) {
        console.error("Error deleting account:", error)
      }
    }
  }

  return (
    <form onSubmit={handleDeleteUser} className="shadow-md  border p-6 rounded-md">
      <UpdateHeading
        heading="Delete Account"
        paragraph="After deleting your account, all data and resources are permanently removed. Enter your password to confirm deletion."
      />
      <Button  type="submit" className="bg-bgColorRed py-2 px-3 rounded-[25px] mt-4 text-white text-sm" value="Delete Account" />
    </form>
  )
}
