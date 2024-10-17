'use client'
import Button from "@/components/Buttons"
import Input from "@/components/Input"
import PageHead from "@/components/PageHead"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { FaGoogle, FaGithub } from "react-icons/fa"

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  })

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' })
  }

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
      if (!payload.email || !payload.password) {
        throw new Error("Please fill in all fields.")
      }

      const res = await signIn("credentials", {
        ...payload,
        redirect: false,
      })

      setLoading(false)
      if (res?.error) {
        setError("Invalid email or password.")
      } else {
        router.push("/")
      }
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }

  return (
    <>
      <PageHead title="Login" description="Login to your account" content="" />
      <section className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
            <p className="text-sm text-gray-600 mt-2">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-blue-600 hover:underline">
                Create one
              </Link>
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleGoogleSignIn}
              type="button"
              className="flex items-center justify-center w-full p-3 bg-white border rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
              value={
                <div className="flex items-center">
                  <FaGoogle className="mr-2 text-lg" />
                  Sign in with Google
                </div>
              }
            />

            <Button
              type="button"
              className="flex items-center justify-center w-full p-3 bg-white border rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
              value={
                <div className="flex items-center">
                  <FaGithub className="mr-2 text-lg" />
                  Sign in with GitHub
                </div>
              }
            />
          </div>

          <div className="flex items-center my-6">
            <span className="w-full border-t border-gray-300"></span>
            <span className="px-2 text-sm text-gray-400">OR</span>
            <span className="w-full border-t border-gray-300"></span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              payload={payload}
              fieldName="email"
              handleChange={handleChange}
              className="w-full h-12 text-base px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Email address"
            />

            <Input
              payload={payload}
              fieldName="password"
              handleChange={handleChange}
              className="w-full h-12 text-base px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              placeholder="Password"
              type="password"
            />

            <button
              type="submit"
              className={`w-full h-12 bg-black text-white rounded-md font-semibold transition-all duration-200 ${
                loading ? 'bg-gray-700 cursor-not-allowed opacity-75' : 'hover:bg-gray-800'
              }`}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </form>
        </div>
      </section>
    </>
  )
}