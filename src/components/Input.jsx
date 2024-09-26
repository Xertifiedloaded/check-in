import React, { useState } from "react"
import Image from "next/image"
import Button from "./Buttons"
import axios from "axios"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"
export default function Input({ payload, fieldName, handleChange, className }) {
  return (
    <div className="my-6">
      <label
        htmlFor={fieldName}
        className="block text-sm text-gray-700 font-medium"
      >
        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
      </label>
      <input
        type={
          fieldName === "password"
            ? "password"
            : fieldName === "email"
            ? "email"
            : "text"
        }
        id={fieldName}
        name={fieldName}
        value={payload[fieldName]}
        onChange={handleChange}
        className={className}
        placeholder={`Enter your ${fieldName}`}
      />
    </div>
  )
}

export function ImageUpload() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({ img: "" })
  const [preview, setPreview] = useState("")
  const [loading, setLoading] = useState(false)
  const userId = session?.user?.id
  const CLOUDINARY_UPLOAD_PRESET = "iboyi7t9"
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/dpn9svwqm/image/upload`

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const data = new FormData()
      data.append("file", file)
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

      try {
        const response = await axios.post(CLOUDINARY_UPLOAD_URL, data)
        setFormData((prev) => ({ ...prev, img: response.data.secure_url }))
        setPreview(response.data.secure_url)
      } catch (error) {
        console.error(
          "Image upload failed:",
          error.response ? error.response.data : error.message
        )
      }
    }
  }

  const handleClearImage = () => {
    setFormData({ img: "" })
    setPreview("")
    document.getElementById("dropzone-file").value = ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const toastId = toast.loading("Uploading, please wait...");
    setLoading(true)
    if (formData.img && userId) {
      try {
        const response = await axios.post("/api/profile-picture", {
          userId,
          imageUrl: formData.img,
        })
        console.log("Profile picture uploaded successfully:", response.data)
        toast.success("Profile Picture Uploaded Successfully", { toastId });
        setLoading(false)
      } catch (error) {
        setLoading(false)
        toast.error(error.response ? error.response.data : error.message, { toastId });
        console.error(
          "Failed to upload profile picture:",
          error.response ? error.response.data : error.message
        )
      }
    } else {
      setLoading(false)
      toast.error("You need to log in or upload an image", { toastId });
      console.log("No image uploaded or user ID is missing")
    }
  }

  return (
    <div className="flex flex-col items-center md:items-start justify-center">
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col items-center justify-center w-64 h-64 border border-gray-300 border-dashed rounded-lg bg-gray-50"
      >
        <div
          className="absolute p-1 rounded-full cursor-pointer right-3 top-3 bg-slate-900"
          onClick={handleClearImage}
        >
          <Image
            src="/trash.svg"
            width={100}
            height={100}
            alt="trash"
            className="w-5 h-5 invert"
          />
        </div>
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center pt-2 pb-3 cursor-pointer"
        >
          <Image
            src="/cloud.svg"
            width={100}
            height={100}
            alt="cloud"
            className="w-10 h-10"
          />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG (MAX. 800x400px)
          </p>
        </label>

        <input
          type="file"
          className="hidden"
          id="dropzone-file"
          accept="image/png, image/jpeg"
          onChange={handleImageUpload}
        />

        {preview && (
          <div className="">
            <Image
              src={preview}
              width={100}
              height={100}
              alt="Preview"
              className="rounded-lg object-cover"
            />
          </div>
        )}

        <div className="mb-2">
          <Button
            value={loading ? "Uploading..." : "Upload Image"}
            type="submit"
            className="px-4 py-2 text-sm font-medium rounded-full bg-gray-800 text-white hover:bg-gray-900 dark:focus:ring-gray-100 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 cursor-pointer inline-flex items-center w-full justify-center disabled:opacity-50 focus:outline-none"
          />
        </div>
      </form>
    </div>
  )
}
