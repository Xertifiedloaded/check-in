
import { Toaster } from "@/components/ui/toaster";

import { DailyCheckIn } from "../components/PostFeed";
import HomePage from "../components/HomePage";

export default function Home() {
  return (
    <>
      <main className="">
        <Toaster />
        <HomePage />
        <DailyCheckIn />
      </main>
    </>
  );
}
