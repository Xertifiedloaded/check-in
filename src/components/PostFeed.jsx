import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import CardComponent from "./Card";
import DailyCheckIn from "./Heading";
import usePosts from "../hooks/usePost";

export default function CheckinPost() {
    const { posts, loadingPosts } = usePosts();

  return (
    <div className="container mx-auto py-8 px-4">
      <DailyCheckIn />
      <div className="gap-4 lg:grid md:grid-cols-4">
        {loadingPosts ? (
          Array.from({ length: 20 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="bg-gray-300 h-20 rounded-t-lg"></CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="bg-gray-300 h-6 rounded"></div>
                <div className="bg-gray-300 h-6 rounded w-3/4"></div>
              </CardContent>
              <CardFooter className="p-4">
                <div className="bg-gray-300 h-5 rounded w-1/2"></div>
              </CardFooter>
            </Card>
          ))
        ) : posts.length > 0 ? (
          posts.map((post) => <CardComponent key={post.id} post={post} />)
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">
            No posts to show. Be the first to check in today!
          </p>
        )}
      </div>
    </div>
  );
}
