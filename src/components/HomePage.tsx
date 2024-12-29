import React from 'react';
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Sparkles, ArrowRight, TrendingUp, Users, ClipboardList, MapPin, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const { data: session, status } = useSession();
  const isUserActive = status === "authenticated";


  return (
    <main className="bg-white dark:bg-black transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {status === "loading" || !isUserActive && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                Track Your Journey
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                Join our community to share your progress, maintain streaks, and connect with like-minded individuals.
              </p>
            </div>

            <Card className="max-w-6xl mx-auto border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-none">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-center">
                  <div className="p-3 bg-violet-100 dark:bg-violet-900/20 rounded-xl">
                    <Sparkles className="w-8 h-8 text-violet-500 dark:text-violet-400" />
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Get Started Today
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Create an account or sign in to begin your journey
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href="/auth/signup" className="w-full sm:w-auto">
                    <Button className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white">
                      Create Account
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/auth/login" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

                 {/* Goals Section */}
                 <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-none">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Your Goals
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Track your daily, weekly, and monthly goals effectively.
                </p>
                <Button className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white">
                  Set Goals
                  <Target className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Explore Section */}
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-none">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Explore the Map
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Discover locations and connect with others near you.
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                  Explore Now
                  <MapPin className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button variant="outline" className="w-full">
                    <ClipboardList className="mr-2 w-5 h-5" />
                    View Progress
                  </Button>
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="mr-2 w-5 h-5" />
                    Set Goals
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 w-5 h-5" />
                    Join Community
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                  Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-violet-500">120</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Days Tracked</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-500">45</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Goals Achieved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                  Community Highlights
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center text-white">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Alex completed a 30-day coding streak!
                    </p>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white">
                      <Users className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Maria joined the Frontend Developers group.
                    </p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) }
      </div>
    </main>
  );
};

export default HomePage;
