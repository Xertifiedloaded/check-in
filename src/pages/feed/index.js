"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { io } from "socket.io-client"; 
import MainHeader from "../MainHeader";
import PageHead from "@/components/PageHead";
import { FeedUserCard } from "@/components/UserFeedCard";

const socket = io("/api/socket"); 

export default function Index() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentLikes, setCommentLikes] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/post/feed");
        setPosts(response.data.posts);
        setCommentLikes(setCommentLikes);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    socket.on("newComment", (newComment) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === newComment.postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );
    });

    socket.on("deletedComment", (removedComment) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === removedComment.postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.id !== removedComment.id
                ),
              }
            : post
        )
      );
    });

    return () => {
      socket.off("newComment");
      socket.off("deletedComment");
    };
  }, []);

  if (loading) {
    return (
      <section className="flex justify-center items-center lg:h-screen h-[90vh] ">
        <div className="loader"></div>
      </section>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <>
      <div>
        <PageHead
          content="Stay on track, achieve your goals, and beat procrastination together!"
          title="Feed"
        />
        <MainHeader />
        <h1>Posts</h1>
        <ul className="nav-wrapper mt-28">
          {posts.map((post) => (
            <FeedUserCard
              key={post.id}
              post={post}
              commentLikes={commentLikes}
              comments={post.comments} 
            />
          ))}
        </ul>
      </div>
    </>
  );
}
