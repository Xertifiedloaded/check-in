import "./global.css"
import { Poppins } from "next/font/google"
import Landing from "./Landing"

const poppin = Poppins({
  weight: ["200", "300", "400", "600", "700", "800"],
  subsets: ["latin"],
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <div className={`${poppin.className}`}>
        <Landing />
        <Component {...pageProps} />
      </div>
    </>
  )
}
