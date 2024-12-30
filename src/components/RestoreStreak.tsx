import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { restoreUserStreak } from "@/hooks/usePost";
import { useSession } from "next-auth/react";

export default function RestoreStreak() {
  const { streak, isLoading, restoreStreak } = restoreUserStreak();
  const [isRestoring, setIsRestoring] = useState(false);
  const { data: session, status } = useSession();

  const isUserActive = status === "authenticated";

  // Early return: Don't render anything unless all conditions are met.
  if (
    isLoading ||
    status === "loading" ||
    !isUserActive ||
    !streak ||
    streak.currentStreak > 0
  ) {
    return null;
  }

  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardContent className="p-6 bg-gradient-to-b from-gray-50 dark:from-gray-800/50">
        <div className="flex flex-col items-center text-center space-y-4">
          <ArrowUpCircle className="w-8 h-8 text-gray-700 dark:text-gray-300" />
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Restore Your Streak
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last check-in:{" "}
            {streak?.lastCheckIn
              ? (() => {
                  const lastCheckInTime = new Date(
                    streak.lastCheckIn
                  ).getTime();
                  const currentTime = new Date().getTime();
                  const hoursAgo = Math.floor(
                    (currentTime - lastCheckInTime) / (1000 * 60 * 60)
                  );
                  return hoursAgo > 0 ? `${hoursAgo} hours ago` : "Just now";
                })()
              : "No recent check-ins"}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Would you like to restore your streak?
          </p>
          <Button
            onClick={async () => {
              setIsRestoring(true);
              try {
                await restoreStreak();
              } catch (error) {
                console.error("Failed to restore streak:", error);
              } finally {
                setIsRestoring(false);
              }
            }}
            disabled={isRestoring}
            className="flex items-center gap-2"
          >
            {isRestoring ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Restoring...
              </>
            ) : (
              <>
                <ArrowUpCircle className="w-4 h-4" />
                Restore Streak
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
