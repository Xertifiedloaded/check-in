import "./global.css"
import "react-toastify/dist/ReactToastify.css"
import { Poppins } from "next/font/google"
import { AuthProvider } from "@/context/AuthContext"
import { CheckInProvider } from "@/context/CheckInContext"
import { ToastContainer } from "react-toastify"
import SessionWrapper from "@/sessionWrapper/SessionWrapper"
import { useVisitTracker } from "@/hooks/UseVisitorsTracker"
import Footer from "@/components/Footer"
import { ThemeProvider } from "@/context/ThemeContext"


const poppin = Poppins({
  weight: ["200", "300", "400", "600", "700", "800"],
  subsets: ["latin"],
})

function App({ Component, pageProps }) {
  useVisitTracker()
  return (
    <div className={`${poppin.className}`}>

       <ThemeProvider>
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
              <Footer/>
            </CheckInProvider>
          </AuthProvider>
        </SessionWrapper>
       </ThemeProvider>

    </div>
  )
}

export default App
