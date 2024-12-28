import "./global.css";
import { Poppins } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import { CheckInProvider } from "../context/CheckInContext";
import SessionWrapper from "../sessionWrapper/SessionWrapper";
import Footer from "../components/Footer";
import { ThemeProvider } from "../context/ThemeContext";

import { useRouter } from "next/router";
import { Toaster } from "@/components/ui/toaster";
import TabNavigation from "../components/Tab";

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

  return (
    <div className={`${poppin.className}`}>
      <ThemeProvider>
        <SessionWrapper>
          <AuthProvider>
            <Toaster />
            <CheckInProvider>
              <Component {...pageProps} />
              {!hiddenFooterRoutes.includes(router.pathname) && (
                <TabNavigation />
              )}
              {!hiddenFooterRoutes.includes(router.pathname) && <Footer />}
            </CheckInProvider>
          </AuthProvider>
        </SessionWrapper>
      </ThemeProvider>
    </div>
  );
}

export default App;
