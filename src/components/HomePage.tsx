import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { restoreUserStreak } from "@/hooks/usePost";
import RestoreStreak from "./RestoreStreak";

export default function HomePage() {
  const { data: session, status } = useSession();
  const isUserActive = status === "authenticated";


  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        {status === "loading" || !isUserActive ? (
          <Card className="bg-white dark:bg-gray-800 border-none shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Join the Community
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                Sign in to track your progress, maintain streaks, and connect
                with others.
              </p>
              <div className="flex space-x-3">
                <Link href="/auth/login">
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" className="px-8">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="relative w-12 h-12">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover ring-2 ring-blue-500/20 dark:ring-blue-400/30"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {Greeting()}
                  </span>
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {session?.user?.name}
                </span>
              </div>
            </div>
  
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800" />
              </Button>
            </div>
          </div>
        )}
  
        <RestoreStreak />
      </div>
    </div>
  </div>
  
  );
}

const getGreeting = () => {
  const hours = new Date().getHours();

  if (hours < 12) {
    return "Good Morning";
  } else if (hours < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};

const Greeting = () => {
  return (
    <span className="text-sm text-gray-500 dark:text-gray-400">
      {getGreeting()},
    </span>
  );
};
