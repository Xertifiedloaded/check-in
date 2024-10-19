import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getSession } from "next-auth/react"

const ProtectedRoute = (WrappedComponent) => {
  return (props) => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)

    useEffect(() => {
      const checkSession = async () => {
        const currentSession = await getSession()
        setSession(currentSession)
        const path = router.pathname
        const isAuthPage = path === "/auth/login" || path === "/auth/signup"
        const isDashboardPage = path.startsWith("/profile/edit")
        const isVerificationPage = path === "/auth/verify-account" || path === "/auth/verification-success"

        if (currentSession) {
          try {
            const response = await fetch('/api/auth/verification')
            if (!response.ok) throw new Error('Failed to fetch verification status')
            const { isVerified } = await response.json()
            if (isAuthPage) {
              router.replace("/profile/edit")
            } else if (isDashboardPage && !isVerified) {
              router.replace("/auth/verify-account")
            } else if (isVerificationPage && isVerified) {
              router.replace("/profile/edit")
            } else {
              setLoading(false)
            }
          } catch (error) {
            console.error('Error checking verification status:', error)
            setLoading(false)
          }
        } else {
          if (isDashboardPage) {
            router.replace("/auth/login")
          } else {
            setLoading(false)
          }
        }
      }
      checkSession()
    }, [router])

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )
    }

    return <WrappedComponent {...props} />
  }
}

export default ProtectedRoute