'use client'
import Button from "@/components/Buttons"
import Input from "@/components/Input"
import PageHead from "@/components/PageHead"
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
    setPayload((prev) => ({ ...prev, [name]: value }))
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

      await res.json()
      router.push("/auth/login")
    } catch (err) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHead title="Sign Up" description="description" content="" />
      <section className="flex h-screen items-center justify-center">
        <div className="max-w-md w-full p-8 space-y-6 border border-gray-300 rounded-md shadow-lg">
          <h2 className="text-2xl font-extrabold text-center text-gray-800">Create a new account</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong>Error: </strong>
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(payload).map((fieldName) => (
              <Input
                key={fieldName}
                payload={payload}
                fieldName={fieldName}
                handleChange={handleChange}
                className="w-full h-10 text-base px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            ))}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md transition duration-200 hover:bg-gray-800"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline text-gray-700">Sign in</Link>
          </p>
        </div>
      </section>
    </>
  )
}
