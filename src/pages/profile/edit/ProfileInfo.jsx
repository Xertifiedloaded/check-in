import Button from "@/components/Buttons"
import Input, { ImageUpload } from "@/components/Input"
import React, { useState } from "react"
import UpdateHeading from "./UpdateHeading"

export default function ProfileInfo() {
  const [payload, setPayload] = useState({
    name: "",
    email: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }))
  }
  return (
    <div className="shadow-md border p-6 rounded-md">

      <UpdateHeading
        heading="Profile Information"
        paragraph="Update your account's profile information and email address."
      />

      <form className="my-4 ">
        <ImageUpload />
      </form>
      <form className="my-4">
        <div className="w-full lg:w-[60%]">
          {Object.keys(payload).map((fieldName) => (
            <Input
              key={fieldName}
              payload={payload}
              fieldName={fieldName}
              handleChange={handleChange}
              className="appearance-none flex w-full h-10  px-3 py-2 text-sm bg-white  border rounded-md border-gray-300  ring-offset-background placeholder:text-gray-500  focus:border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-200/60  disabled:cursor-not-allowed disabled:opacity-50 "
            />
          ))}
        </div>
        <div className="mb-2">
          <Button
            type="submit"
            value="Update"
            className="px-4 py-2  text-sm font-medium rounded-full bg-gray-800  text-white hover:bg-gray-900  dark:focus:ring-gray-100   focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 cursor-pointer inline-flex items-center  justify-center disabled:opacity-50  focus:outline-none"
          />
        </div>
      </form>
    </div>
  )
}
