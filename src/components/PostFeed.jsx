import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  Lock,
  Globe,
  Sparkles,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import usePosts from "../hooks/usePost";
import { PostSkeleton } from "./Skeletal";
import { CardComponent } from "./Card";

export const DailyCheckIn = () => {
  const { fetchPosts, setPosts, posts, loadingPosts } = usePosts();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { data: session } = useSession();
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
   <section className="wrapper">
     <Card className='max-w-2xl mx-auto'>
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-t-lg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <CardTitle>Daily Check-In</CardTitle>
          </div>
          <Sparkles className="w-6 h-6 text-yellow-300" />
        </div>
        <CardDescription className="text-white/90">
          Share your daily progress and inspire others!
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content">Your Check-in</Label>
            <Textarea
              id="content"
              placeholder={
                userId
                  ? "What will you accomplish today? Share your steps, wins, big or small..."
                  : "Please login to share your progress..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={!userId}
              className="min-h-[150px] resize-none"
            />
          </div>

          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={visibility}
                onValueChange={setVisibility}
                disabled={!userId}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>Public Post</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="PRIVATE">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>Private Note</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-4 w-full sm:justify-end">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image-upload").click()}
                  disabled={!userId}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
              </div>

              <Button
                type="submit"
                disabled={!userId || !content.trim() || loading}
                className="bg-gradient-to-r text-white from-indigo-600 to-violet-600"
              >
                {loading ? "Loading" : "Share Progress"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="border-t">
        <div className="flex items-center gap-2 text-gray-600">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <p className="text-sm my-2">
            Pro tip: Share specific achievements to inspire others!
          </p>
        </div>
      </CardFooter>
    </Card>

    <div className="mt-8  grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
  );
};
