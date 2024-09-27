import React from "react"
import UpdateHeading from "./UpdateHeading"
import Button from "@/components/Buttons"

export default function DeleteAccount() {
  return (
    <div className="shadow-md  border p-6 rounded-md">
      <UpdateHeading
        heading="Delete Account"
        paragraph="After deleting your account, all data and resources are permanently removed. Enter your password to confirm deletion."
      />

      <Button type="submit" className="bg-bgColorRed py-2 px-3 rounded-[25px] mt-4 text-white text-sm" value="Delete Account" />
    </div>
  )
}
