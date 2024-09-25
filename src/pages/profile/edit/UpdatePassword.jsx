import Input from "@/components/Input"
import React, { useState } from "react"
import UpdateHeading from "./UpdateHeading"

export default function UpdatePassword() {
  const [payload, setPayload] = useState({
    name: "",
    password: "",
    confimNewPassword: "",
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
        heading="Update Password"
        paragraph="Ensure your account is using a long, random password to stay secure."
      />

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
      </form>
    </div>
  )
}
