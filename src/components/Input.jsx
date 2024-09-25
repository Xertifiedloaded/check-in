import React from "react"
import Image from "next/image"
import Button from "./Buttons"
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
  return (
    <div className="flex flex-col items-center md:items-start justify-center">
      <div
        for="dropzone-file"
        className="relative flex flex-col items-center justify-center w-64 h-64 border border-gray-300 border-dashed rounded-lg bg-gray-50      "
      >
        <div className="absolute p-1 rounded-full cursor-pointer right-3 top-3 bg-slate-900 ">
          <Image
            src="/trash.svg"
            width={100}
            height={100}
            alt="cloud"
            className="w-5 h-5 invert"
          />
        </div>
        <label
          for="dropzone-file"
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
        />

        <div className="mb-2">
          <Button
            type="submit"
            value="Update"
            className="px-4 py-2 text-sm font-medium rounded-full bg-gray-800  text-white hover:bg-gray-900  dark:focus:ring-gray-100   focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 cursor-pointer inline-flex items-center w-full justify-center disabled:opacity-50  focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
