'use client'
import { useState, useEffect } from "react";
import axios from "axios";

export default function useLikeStatus(userId, postId) {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0); 

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/post/like-unlike", {
          params: {
            userId,
            postId,
          },
        });
        setIsLiked(response.data.liked);
        setCount(response.data.likeCount);
      } catch (error) {
        console.error("Error fetching like status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId && postId) {
      fetchLikeStatus();
    }
  }, [userId, postId]);

  const toggleLike = async () => {
    try {
      const response = await axios.post("/api/post/like-unlike", {
        userId,
        postId,
      });
      
      setIsLiked((prevLiked) => !prevLiked);
    
      setCount(response.data.likeCount); 
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return { isLiked, toggleLike, loading, count }; 
}





const editPost = async (postId, userId, content) => {
  try {
    const response = await axios.put(`/api/post/${postId}`, { userId, content })
    console.log(response.data.message)
  } catch (error) {
    console.error("Error editing post:", error)
  }
}

const deletePost = async (postId, userId) => {
  try {
    const response = await axios.delete(`/api/post/${postId}`, {
      data: { userId },
    })
    console.log(response.data.message)
  } catch (error) {
    console.error("Error deleting post:", error)
  }
}


const fetchUserPosts = async (userId) => {
    try {
      const response = await axios.get('/api/posts', {
        params: { userId }, 
      });
      console.log('User posts:', response.data); 
    } catch (error) {
      console.error('Error fetching user posts:', error.response.data.message);
    }
  };
  

  