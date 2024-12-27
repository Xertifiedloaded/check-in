"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function useLikeStatus(userId, postId) {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchLikeStatus = async () => {
    if (!postId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("/api/post/like-unlike", {
        params: { postId },
      });

      // Safely set the like status and count
      setIsLiked(response.data?.liked || false);
      setCount(response.data?.likeCount || 0);
    } catch (error) {
      console.error("Error fetching like status:", error);
      setError("Failed to fetch like status");
      toast({
        title: "Error",
        description: "Failed to fetch like status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikeStatus();
  }, [postId]);

  const toggleLike = async () => {
    if (!userId) {
      toast({
        title: "Action Required",
        description: "You need to log in before you can like the post.",
        variant: "destructive",
      });
      return { liked: isLiked, likeCount: count };
    }

    try {
      const newLikedStatus = !isLiked;
      const newLikeCount = newLikedStatus ? count + 1 : count - 1;

      setIsLiked(newLikedStatus);
      setCount(newLikeCount);

      const response = await axios.post("/api/post/like-unlike", { postId });

      const finalLikedStatus = response.data?.liked || newLikedStatus;
      const finalLikeCount = response.data?.likeCount || newLikeCount;

      setIsLiked(finalLikedStatus);
      setCount(finalLikeCount);

      toast({
        title: finalLikedStatus ? "Liked!" : "Unliked!",
        description: `The post now has ${finalLikeCount} like(s).`,
      });

      return { liked: finalLikedStatus, likeCount: finalLikeCount };
    } catch (error) {
      console.error("Error toggling like:", error);
      setError("Failed to toggle like.");
      toast({
        title: "Error",
        description: "Failed to toggle like. Please try again.",
        variant: "destructive",
      });
      return { liked: isLiked, likeCount: count };
    }
  };

  return { isLiked, toggleLike, loading, count, error };
}
