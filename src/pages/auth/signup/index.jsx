'use client'
import Button from "@/components/Buttons"
import Input from "@/components/Input"
import PageHead from "@/components/PageHead"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"

export default function Signup() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  })
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/post/postsignup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to create account")
      }
      console.log(res)

      await res.json()
      router.push("/auth/login")
    } catch (err) {
      console.error("Error during signup:", err)
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHead title="Sign Up" description="description" content="" />
      <section className="grid h-screen place-items-center w-full">
        <div className="max-w-lg w-full mx-auto">
          <div className="text-center my-5">
            <h2 className="my-4 text-2xl font-extrabold leading-9 text-center text-gray-800">
              Create a new account
            </h2>
            <p className="flex justify-center gap-3 items-center">
              <span>or</span>
              <Link
                className="text-gray-500 underline cursor-pointer text-sm hover:text-gray-800"
                href="/auth/login"
              >
                sign in to your account
              </Link>
            </p>
          </div>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4 shadow-sm border p-6 rounded-md"
          >
            <fieldset className="border-t my-4 text-center text-xs">
              <legend>or</legend>
            </fieldset>
            {Object.keys(payload).map((fieldName) => (
              <Input
                key={fieldName}
                payload={payload}
                fieldName={fieldName}
                handleChange={handleChange}
                className="appearance-none flex w-full h-10 px-3 py-2 text-sm bg-white border rounded-md border-gray-300 ring-offset-background placeholder:text-gray-500 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200/60 disabled:cursor-not-allowed disabled:opacity-50"
              />
            ))}

            <button
              type="submit"
              className="bg-black text-white py-2 px-4 rounded w-full"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
