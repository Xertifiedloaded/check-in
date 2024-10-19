import "./global.css"
import "react-toastify/dist/ReactToastify.css"
import { Poppins } from "next/font/google"
import { AuthProvider } from "@/context/AuthContext"
import { CheckInProvider } from "@/context/CheckInContext"
import { ToastContainer } from "react-toastify"
import SessionWrapper from "@/sessionWrapper/SessionWrapper"
import { useVisitTracker } from "@/hooks/UseVisitorsTracker"


const poppin = Poppins({
  weight: ["200", "300", "400", "600", "700", "800"],
  subsets: ["latin"],
})

function App({ Component, pageProps }) {
  useVisitTracker()
  return (
    <div className={`${poppin.className}`}>

        <SessionWrapper>
          <AuthProvider>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              closeOnClick
              draggable
              pauseOnHover
              theme="light"
            />
            <CheckInProvider>
              <Component {...pageProps} />
            </CheckInProvider>
          </AuthProvider>
        </SessionWrapper>

    </div>
  )
}

export default App
