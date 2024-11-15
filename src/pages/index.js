import Head from "next/head";
import { Toaster } from "@/components/ui/toaster"
import CheckIn from "../components/CheckIn";
import { useCheckIn } from "../context/CheckInContext";
import MainHeader from "./MainHeader";
import { MessageCircle } from "lucide-react";
import TabsWrapper from "../components/TabComponent";
export default function Home() {
  const { loadingCheckIns, error } = useCheckIn();

  if (loadingCheckIns) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title className="">Daily Check-in</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta
          name="description"
          content="Learn about Daily Check-in, our mission, and our team."
        />
      </Head>
      <main className="mt-28">
      <Toaster />
        <MainHeader />
        <TabsWrapper />
        <CheckIn />
      </main>
    </>
  );
}
