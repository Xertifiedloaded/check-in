"use client"

import React, { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"
import { FaGoogle } from "react-icons/fa"
import Button from "../components/Buttons"
import Input from "../components/Input"
import PageHead from "../components/PageHead"
import ProtectedRoute from "../hooks/ProtectedRoute"

const Signup = () => {
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
    signIn("google", { callbackUrl: "/" })
  }

  return (
    <>
      <PageHead
        title="Sign Up"
        description="Create your account and join the community"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Create an Account
            </h2>
            <p className="text-sm text-center text-gray-600 mb-8">
              Join our community and get started
            </p>

            {error && (
              <div
                className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                role="alert"
              >
                <p>{error}</p>
              </div>
            )}

            <Button
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-4"
              value={
                <div className="flex items-center">
                  <FaGoogle className="mr-2 text-red-500" />
                  <span>Sign up with Google</span>
                </div>
              }
            />

            <div className="my-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <span className="text-xs text-center text-gray-500 uppercase">
                or sign up with email
              </span>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.keys(payload).map((fieldName) => (
                <Input
                  key={fieldName}
                  payload={payload}
                  fieldName={fieldName}
                  handleChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 placeholder:text-xs rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  type={
                    fieldName.toLowerCase().includes("password")
                      ? "password"
                      : "text"
                  }
                  placeholder={
                    fieldName.charAt(0).toUpperCase() +
                    fieldName
                      .slice(1)
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                  }
                />
              ))}
              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg ${
                  loading
                    ? "opacity-75 cursor-not-allowed"
                    : "hover:from-purple-700 hover:to-pink-700"
                }`}
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-600 text-center">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-purple-600 hover:underline font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
export default ProtectedRoute(Signup)
