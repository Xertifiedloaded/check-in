'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function useLikeStatus(userId, postId) {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        setLoading(true);
        setError(null); 

        const response = await axios.get("/api/post/like-unlike", {
          params: { postId },
        });
        
        setIsLiked(response.data.liked || false); 
        setCount(response.data.likeCount); 
      } catch (error) {
        console.error("Error fetching like status:", error);
        setError("Failed to fetch like status");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchLikeStatus(); 
    }
  }, [postId]);

  const toggleLike = async () => {
    try {
      if (!userId) {
        toast.error("You need to log in before you can like the post");
        return;
      }

      const response = await axios.post("/api/post/like-unlike", { postId });

      setIsLiked(response.data.liked); 
      setCount(response.data.likeCount); 
    } catch (error) {
      console.error("Error toggling like:", error);
      setError("Failed to toggle like");
      toast.error("Failed to update like status");
    }
  };

  return { isLiked, toggleLike, loading, count, error };
}
