import Head from "next/head";
import { Toaster } from "@/components/ui/toaster"
import CheckIn from "../components/CheckIn";
import { useCheckIn } from "../context/CheckInContext";
import { MessageCircle } from "lucide-react";
import CheckinPost from "../components/PostFeed";
import MainHeader from './MainHeader';
export default function Home() {

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
      <CheckinPost/>

        {/* <TabsWrapper />
        <CheckIn /> */}
      </main>
    </>
  );
}
