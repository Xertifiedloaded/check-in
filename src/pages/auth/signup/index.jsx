'use client'
import Button from "@/components/Buttons"
import Input from "@/components/Input"
import PageHead from "@/components/PageHead"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { signIn } from "next-auth/react"
import { FaGoogle } from "react-icons/fa"

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

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <>
      <PageHead title="Sign Up" description="Create your account and join the community" />
      <section className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-lg w-full p-8 bg-white shadow-md rounded-lg">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">Create an Account</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-600 px-4 py-3 rounded-md mb-4 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}


          <Button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full flex items-center justify-center py-2 mb-4 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition duration-200"
            value={
              <div className="flex items-center">
                <FaGoogle className="mr-2" />
                <span>Sign up with Google</span>
              </div>
            }
          />

          <fieldset className="border-t my-4 text-center text-sm text-gray-500">
            <legend className="px-2 bg-white">or</legend>
          </fieldset>

          <form onSubmit={handleSubmit} className="space-y-5">
            {Object.keys(payload).map((fieldName) => (
              <Input
                key={fieldName}
                payload={payload}
                fieldName={fieldName}
                handleChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
              />
            ))}
            <button
              type="submit"
              className={`w-full py-3 text-white bg-blue-600 rounded-lg transition duration-200 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">Sign In</Link>
          </p>
        </div>
      </section>
    </>
  )
}