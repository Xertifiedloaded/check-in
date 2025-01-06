"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import {
  Clock,
  Lock,
  Globe,
  Sparkles,
  Camera,
  Send,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import usePosts, { useRestoreStreak } from "../hooks/usePost";
import { PostSkeleton } from "./Skeletal";
import { CardComponent } from "./Card";
import StreakManager from "./StreakManager";

const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return "morning";
  if (hours < 18) return "afternoon";
  return "evening";
};
export function CurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <p className="text-xs text-zinc-500 dark:text-zinc-400">
      {currentTime.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })}{" "}
      {currentTime.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}
    </p>
  );
}

export const DailyCheckIn = () => {
  const { fetchPosts, setPosts, posts, loadingPosts } = usePosts();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { data: session, status } = useSession();
  const isUserActive = status === "authenticated" && status !== "loading";
  const { setisStreakLoader, message, currentStreak, handleRestoreStreak } =
    useRestoreStreak();
  const userId = session?.user?.id;
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image must be less than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!userId) {
      toast({
        title: "Error",
        description: "You need to log in to check in.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Content cannot be empty.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("visibility", visibility);
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch("/api/post/post", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to post check-in");

      const result = await response.json();
      console.log(result);
      fetchPosts();
      setPosts((prevPosts) => [result.checkIn, ...prevPosts]);
      toast({
        title: "Success",
        description: "Check-in posted successfully!",
        duration: 3000,
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });

      setContent("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post check-in",
        duration: 3000,
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isUserActive && (
        <section className="wrapper">
          <div className="space-y-6 max-w-5xl mx-auto py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-full">
                  <Clock className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Daily Check-in
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Good {getGreeting()} {session?.user?.name}
                  </p>
                  <CurrentTime />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setVisibility("PRIVATE")}
                  className={`rounded-full ${
                    visibility === "PRIVATE"
                      ? "bg-zinc-200 dark:bg-zinc-800"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Lock
                    className={`w-4 h-4 ${
                      visibility === "PRIVATE"
                        ? "text-zinc-900 dark:text-zinc-50"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setVisibility("PUBLIC")}
                  className={`rounded-full ${
                    visibility === "PUBLIC"
                      ? "bg-zinc-200 dark:bg-zinc-800"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Globe
                    className={`w-4 h-4 ${
                      visibility === "PUBLIC"
                        ? "text-zinc-900 dark:text-zinc-50"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  />
                </Button>
              </div>
            </div>
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-none">
              <CardContent className="p-6 space-y-6">
                <div className="flex gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        fill
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-lg font-medium">
                        {session?.user?.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Textarea */}
                  <div className="flex-1">
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={`What's on your mind this ${getGreeting()} ?`}
                      className="min-h-[120px] placeholder:text-xs border-none resize-none bg-transparent text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:ring-0 p-0 text-lg"
                    />
                  </div>
                </div>
                {imagePreview && (
                  <div className="relative group rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-[300px] object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  {/* File input button */}
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                      onClick={() =>
                        document.getElementById("image-upload").click()
                      }
                    >
                      <Camera className="w-5 h-5" />
                    </Button>
                    <Separator
                      orientation="vertical"
                      className="h-6 bg-zinc-200 dark:bg-zinc-800"
                    />
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>

                  {/* Submit button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={!userId || !content.trim() || loading}
                    className="rounded-full px-6 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Posting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Share</span>
                        <Send className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Inspiration Card */}
            <Card className="border-none bg-gradient-to-r from-violet-500/10 to-indigo-500/10 dark:from-violet-500/5 dark:to-indigo-500/5">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-white/80 dark:bg-zinc-900/80 rounded-lg backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  Share your journey and inspire others in the community
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="flex my-10 justify-between items-center">
            <h1 className="text-lg lg:text-3xl ">Explore Checkin's</h1>
            {currentStreak === null ||
              (currentStreak <= 0 && <StreakManager />)}
          </div>
          <div className=" grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loadingPosts ? (
              Array.from({ length: 8 }).map((_, index) => (
                <PostSkeleton key={index} />
              ))
            ) : posts.length > 0 ? (
              posts.map((post) => <CardComponent key={post.id} post={post} />)
            ) : (
              <p>No posts yet. Share your first one!</p>
            )}
          </div>
        </section>
      )}
      <Toaster />
    </>
  );
};
