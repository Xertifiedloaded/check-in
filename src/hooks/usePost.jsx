import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';


const usePosts = () => {
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const { toast } = useToast();
  
    useEffect(() => {
      fetchPosts();
    }, []);
  
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
  
    return { posts, loadingPosts, setPosts ,fetchPosts};
  };
  
  export default usePosts;
  
