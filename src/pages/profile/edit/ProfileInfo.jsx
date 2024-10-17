'use client'
import Button from "@/components/Buttons"
import Input, { ImageUpload } from "@/components/Input"
import React, { useState } from "react"
import UpdateHeading from "./UpdateHeading"
import UpdateProfileNameAndEmail from "./UpdateNameEmail"

export default function ProfileInfo() {
  return (
    <div className="shadow-md border  p-6 rounded-md">
      <UpdateHeading
        heading="Profile Information"
        paragraph="Update your account's profile information and email address."
      />
      {/* <ImageUpload /> */}
      <UpdateProfileNameAndEmail />
    </div>
  )
}
