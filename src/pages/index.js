
import { Toaster } from "@/components/ui/toaster";

import { DailyCheckIn } from "../components/PostFeed";
import HomePage from "../components/HomePage";
import CelebrationBanner from "../components/Celebration";

export default function Home() {
  return (
    <>
      <main className="">
        <CelebrationBanner/>
        <HomePage />
        <DailyCheckIn />
      </main>
    </>
  );
}
