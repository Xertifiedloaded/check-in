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

export const restoreUserStreak = () => {
  const [streak, setStreak] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStreak = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/user/currentstreak");

        setStreak(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error.response?.data?.error || "Failed to fetch streak data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, [toast]);

  const restoreStreak = async () => {
    try {
      const response = await axios.post("/api/user/currentstreak");
      toast({
        title: "Success",
        description: response.data.message,
        variant: "success",
      });

      const updatedStreak = await axios.get("/api/user/currentstreak");
      setStreak(updatedStreak.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to restore streak.",
        variant: "destructive",
      });
    } finally {
      setShowRestoreModal(false);
    }
  };

  return {
    streak,
    loading,
    currentStreak: streak?.currentStreak,
    showRestoreModal,
    setShowRestoreModal,
    restoreStreak,
  };
};

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

  return { streaks, isLoading, error, refetch: fetchStreaks };
};





