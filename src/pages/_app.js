import "./global.css";
import { Poppins } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import { CheckInProvider } from "../context/CheckInContext";
import SessionWrapper from "../sessionWrapper/SessionWrapper";
import { useVisitTracker } from "../hooks/UseVisitorsTracker";
import Footer from "../components/Footer";
import { ThemeProvider } from "../context/ThemeContext";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/router";
import { Toaster } from "@/components/ui/toaster";

const poppin = Poppins({
  weight: ["200", "300", "400", "600", "700", "800"],
  subsets: ["latin"],
});

function App({ Component, pageProps }) {
  const router = useRouter();
  const hiddenFooterRoutes = [
    "/auth/signup",
    "/auth/login",
    "/chat",
    "/reset-password",
    "/forget-password",
    "/account-verified",
    "/verify-account",
    "/personal-space",
  ];

  useVisitTracker();
  return (
    <div className={`${poppin.className}`}>
      <ThemeProvider>
        <SessionWrapper>
          <AuthProvider>
            <Toaster />
            <CheckInProvider>
              <Component {...pageProps} />
              {!hiddenFooterRoutes.includes(router.pathname) && <Footer />}
            </CheckInProvider>
          </AuthProvider>
        </SessionWrapper>
      </ThemeProvider>
    </div>
  );
}

export default App;
