import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/post/all");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch posts",
        duration: 3000,
      });
    } finally {
      setLoadingPosts(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  return { posts, loadingPosts, setPosts, fetchPosts };
};

export default usePosts;

export const useRestoreStreak = () => {
  const [isSteakLoading, setLoading] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(null);
  const { toast } = useToast();
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  useEffect(() => {
    const fetchCurrentStreak = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/user/currentstreak`);
        const data = await response.json();

        if (response.ok) {
          setCurrentStreak(data.currentStreak);
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to fetch current streak.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to fetch current streak:", error);
        toast({
          title: "Error",
          description: "Something went wrong while fetching your streak.",
          variant: "destructive",
        });
      }
    };

    fetchCurrentStreak();
  }, [userId]);

  const restoreStreak = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You need to log in to restore your streak.",
        variant: "destructive",
        action: {
          label: "Login",
          onClick: () => {},
        },
      });
      return;
    }

    if (!currentStreak) {
      toast({
        title: "No Streak Found",
        description:
          "You don't have an active streak. Would you like to restore it?",
        variant: "warning",
        action: {
          label: "Restore Streak",
          onClick: async () => {
            await performStreakRestore();
          },
        },
      });
      return;
    }

    await performStreakRestore();
  };

  const performStreakRestore = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/post/restore-streak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your streak has been restored!",
          variant: "success",
          action: {
            label: "Undo",
            onClick: () => {
              toast({
                title: "Undo Successful",
                description: "Your streak restoration has been undone.",
                variant: "neutral",
              });
            },
          },
        });
      } else {
        toast({
          title: "Error",
          description:
            data.error || "An error occurred while restoring your streak.",
          variant: "destructive",
          action: {
            label: "Retry",
            onClick: restoreStreak,
          },
        });
        setError(data.error || "Failed to restore streak.");
      }
    } catch (error) {
      console.error("Failed to restore streak:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
        action: {
          label: "Retry",
          onClick: restoreStreak,
        },
      });
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return {
    restoreStreak,
    isSteakLoading,
    currentStreak,
    error,
  };
};
