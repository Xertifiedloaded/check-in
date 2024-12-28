import Head from "next/head";
import { Toaster } from "@/components/ui/toaster";

import { DailyCheckIn } from "../components/PostFeed";
import HomePage from "../components/HomePage";

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
      <main className="">
        <Toaster />
        <HomePage />
        <DailyCheckIn />
      </main>
    </>
  );
}
