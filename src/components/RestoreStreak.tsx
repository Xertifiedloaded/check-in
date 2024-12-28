import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { restoreUserStreak } from "@/hooks/usePost";
import { useSession } from "next-auth/react";

export default function RestoreStreak() {
  const {
    streak,
    loading,
    showRestoreModal,
    setShowRestoreModal,
    restoreStreak,
  } = restoreUserStreak();
  
  const [isRestoring, setIsRestoring] = useState<boolean>(false); 
  const [isRestored, setIsRestored] = useState<boolean>(false); 
  const { data: session, status } = useSession();
  const isLoadingStatus = status === "loading";
  const isUserActive = status === "authenticated";
  if (isLoadingStatus || !isUserActive) {
    return null;
  }

  if (loading) {
    return (
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-6 bg-gradient-to-b from-gray-50 dark:from-gray-800/50">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Loading streak data...
          </div>
        </CardContent>
      </Card>
    );
  }


  if (!streak || streak.currentStreak === null || streak.currentStreak <= 0) {
    return (
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-6 bg-gradient-to-b from-gray-50 dark:from-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRestoreModal(true)}
                className="flex items-center gap-2"
              >
                <ArrowUpCircle className="w-4 h-4" />
                Restore Streak
              </Button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last check-in: {streak ? Math.floor((new Date().getTime() - new Date(streak.lastCheckIn).getTime()) / (1000 * 60 * 60)) : 0} hours ago
            </div>
          </div>

          {showRestoreModal && (
            <div className="mt-4">
              <p>Are you sure you want to restore your streak?</p>
              <Button
                onClick={async () => {
                  setIsRestoring(true);
                  try {
                    await restoreStreak(); 
                    setIsRestored(true);
                    setShowRestoreModal(false); 
                    setIsRestoring(false); 
                  } catch (error) {
                    console.error("Failed to restore streak:", error);
                    setIsRestoring(false);
                  }
                }}
                className="mt-2"
                disabled={isRestoring} 
              >
                {isRestoring ? "Restoring..." : "Confirm Restore"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (isRestored) {
    return null;
  }

  return null;
}
