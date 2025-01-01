import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

import { DailyCheckIn } from "../components/PostFeed";
import HomePage from "../components/HomePage";
import useFcmToken from "../hooks/useFcmToken";

export default function Home() {
  return (
    <>
      <main className="">
        <HomePage />
        <div className="wrapper flex text-xs justify-center items-center">
          <Worker />
        </div>
        <DailyCheckIn />
      </main>
    </>
  );
}

export function Worker() {
  const { token, notificationPermissionStatus } = useFcmToken();

  const handleTestNotification = async () => {
    const response = await fetch("/api/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        title: "Test Notification",
        message: "This is a test notification",
        link: "https://daily-check-in.com.ng", 
      }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <main className="p-10">
      {notificationPermissionStatus === "granted" ? (
        <p>Permission to receive push notifications has been granted.</p>
      ) : notificationPermissionStatus !== null ? (
        <p>
          You have not granted permission to receive notifications. Please
          enable notifications in your browser settings.
        </p>
      ) : null}

      <Button
        disabled={!token}
        className="mt-5"
        onClick={handleTestNotification}
      >
        Send Test Notification
      </Button>
    </main>
  );
}
