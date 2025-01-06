import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import axios from "axios";

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


export const useUserProfile = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/user/profile/userinfo?userId=${userId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setProfile(data.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile data",
      });
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, fetchProfile };
};



export const useStreaks = () => {
  const [streaks, setStreaks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchStreaks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/post/streak");
      if (!response.ok) {
        throw new Error("Failed to fetch streaks.");
      }
      const data = await response.json();
      setStreaks(data);
    } catch (err) {
      console.error("Error fetching streaks:", err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch streaks. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const restoreStreak = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/post/streak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restoreStreak: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to restore streak.");
      }

      const data = await response.json();
      setStreaks(data.streak);

      toast({
        title: "Success",
        description: "Streak restored successfully.",
        variant: "success",
      });
    } catch (err) {
      console.error("Error restoring streak:", err);
      setError(err.message);

      toast({
        title: "Error",
        description: "Failed to restore streak. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStreaks();
  }, []);

  return { streaks, isLoading, error, refetch: fetchStreaks, restoreStreak };
};







export const useRestoreStreak = () => {
  const [isStreakLoader, setisStreakLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [currentStreak, setCurrentStreak] = useState(null);

  // Fetch current streak
  const fetchStreak = async () => {
    try {
      const response = await axios.get("/api/user/currentstreak");
      setCurrentStreak(response.data.streak.currentStreak);
      console.log(currentStreak);
    } catch (error) {
      console.error("Failed to fetch streak:", error);
    }
  };

  useEffect(() => {
    fetchStreak();
  }, []);

  // Handle restore streak
  const handleRestoreStreak = async () => {
    setisStreakLoader(true);
    setMessage("");
    try {
      const response = await axios.patch("/api/user/currentstreak", {
        restoreStreakRequested: true,
      });
      setMessage(response.data.message);
      fetchStreak();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to restore streak. Please try again."
      );
    } finally {
      setisStreakLoader(false);
    }
  };

  return {
    isStreakLoader,
    message,
    currentStreak,
    handleRestoreStreak,
  };
};


