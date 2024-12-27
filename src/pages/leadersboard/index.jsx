import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';


export default function LeadersBoard() {
  const [streaks, setStreaks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast(); 

  const fetchStreaks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/post/streak");
      if (!response.ok) {
        throw new Error("Failed to fetch ongoing streaks");
      }
      const data = await response.json();
      setStreaks(data);
      toast({
        title: "Success",
        description: "Ongoing streaks fetched successfully!",
        variant: "default",
      });
    } catch (err) {
      console.error("Error fetching streaks:", err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch streaks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStreaks(); 
  }, []);

  const SkeletonLoader = () => (
    <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md animate-pulse">
      <div className="flex-shrink-0 w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      <div className="flex-grow ml-4">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="wrapper mx-auto my-10 px-4 dark:bg-black dark:text-white">
      <h2 className="text-3xl font-semibold mb-6 text-center">Leaderboard</h2>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <div className="flex flex-col space-y-4">
        {isLoading ? (

          Array(5)
            .fill(0)
            .map((_, index) => <SkeletonLoader key={index} />)
        ) : streaks.length > 0 ? (
          streaks.map((streak) => (
            <section
              key={streak.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={streak.userProfilePicture || "/user.svg"} 
                  alt={streak.userName}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h3 className="text-sm font-semibold">{streak.userName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Rank: {streak.rank}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">{streak.currentStreak}</span>
                <p className="text-xs text-gray-500 dark:text-gray-300">Streak</p>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs font-bold">
                  {new Date(streak.lastCheckIn).toLocaleDateString()}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-300">Last Check-In</p>
              </div>
            </section>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-300">
            No user streaks available.
          </div>
        )}
      </div>
    </div>
  );
}
