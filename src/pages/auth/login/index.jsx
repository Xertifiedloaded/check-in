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
  };

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
    try {
      if (!payload.email || !payload.password) {
        throw new Error("Please fill all input fields")
      }
      const res = await signIn("credentials", {
        ...payload,
        redirect: false,
      })

      setLoading(false)
      if (res?.error) {
        setError("Error logging in")
      } else {
        setError(null)
        router.push("/")
      }
    } catch (error) {
      setLoading(false)
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <>
      <PageHead title="Login" description="description" content="" />
      <section className="flex items-center justify-center h-screen w-full bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-500">
              or{" "}
              <Link className="text-blue-500 hover:underline" href="/auth/signup">
                create a new account
              </Link>
            </p>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            type="button"
            className="flex justify-center items-center w-full p-2 mb-4 text-sm font-medium text-gray-500 bg-gray-100 border rounded-md hover:bg-gray-200 transition duration-200"
            value={
              <div className="flex items-center">
                <FaGoogle className="mr-2" />
                <span>Login With Google</span>
              </div>
            }
          />
          <Button
            type="button"
            className="flex justify-center items-center w-full p-2 mb-4 text-sm font-medium text-gray-500 bg-gray-100 border rounded-md hover:bg-gray-200 transition duration-200"
            value={
              <div className="flex items-center">
                <FaGithub className="mr-2" />
                <span>Login With GitHub</span>
              </div>
            }
          />
          
          <fieldset className="border-t my-4 text-center text-xs">
            <legend className="bg-white px-2">or</legend>
          </fieldset>

          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(payload).map((fieldName) => (
              <Input
                key={fieldName}
                payload={payload}
                fieldName={fieldName}
                handleChange={handleChange}
                className="w-full h-10 text-base px-3 py-2 text-sm border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
            ))}
            <button
              type="submit"
              className={`w-full py-2 text-white bg-black rounded-md transition duration-200 hover:bg-gray-800 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
          {error && <small className="text-red-500 mt-2">{error}</small>}
        </div>
      </section>
    </>
  )
}
