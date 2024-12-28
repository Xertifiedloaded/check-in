import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const LoadingIndicator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return isLoading ? (
    <div className="fixed top-0 left-0 right-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="loader">Loading...</div>
    </div>
  ) : null;
};

export default LoadingIndicator;
