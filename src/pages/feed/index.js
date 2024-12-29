"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { FeedUserCard } from "@/components/UserFeedCard";
import {
  MessageCircle,
  RefreshCw,
  ArrowLeft,
  Loader2,
  PenSquare,
  Users,
  AlertCircle,
} from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get("/api/post/feed");
      setPosts(response.data.posts);
      setError(null);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-5xl mx-auto px-4 pt-20">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[160px]" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-4">
            <p>{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPosts}
              className="w-fit"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Head>
        <title>Community Feed | Daily Check-in</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta
          name="description"
          content="Explore daily check-ins and connect with our vibrant community sharing their experiences and progress."
        />
      </Head>

      <header className="fixed top-0 inset-x-0 h-16 bg-background/80 backdrop-blur-sm border-b z-50">
        <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            {posts.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm">
                  {posts.length} {posts.length === 1 ? "update" : "updates"}
                </span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPosts}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing" : "Refresh"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        <div className="pt-24 pb-8">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Community Feed
            </h1>
            <p className="text-muted-foreground">
              See what everyone's been up to today
            </p>
          </div>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            {posts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Updates Yet</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Be the first to share your progress with the community! Your
                    updates will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="">
                {posts.map((post) => (
                  <FeedUserCard post={post} comments={post.comments} />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </main>

      <Button
        size="icon"
        className="fixed bottom-8 right-8 h-12 w-12 rounded-full shadow-lg"
      >
        <PenSquare className="h-5 w-5" />
      </Button>
    </div>
  );
}
