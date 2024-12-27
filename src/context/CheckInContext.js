"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from '@/hooks/use-toast';

const CheckInContext = createContext();

export const CheckInProvider = ({ children }) => {
  const { toast } = useToast();

  const [todayPosts, setTodayPosts] = useState([]);
  const [yesterdayPosts, setYesterdayPosts] = useState([]);

  const [loadingCheckIns, setLoadingCheckIns] = useState(true);
  const [loadingStreaks, setLoadingStreaks] = useState(true);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feed, setFeed] = useState([]);
  const [streaks, setStreaks] = useState([]);

  const fetchCheckIns = async () => {
    setLoadingCheckIns(true);
    try {
      const response = await fetch("/api/post/all");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTodayPosts(data.posts);
      toast({
        title: "Success",
        description: "Today's posts fetched successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to fetch today's posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingCheckIns(false);
    }
  };

  const fetchStreaks = async () => {
    setLoadingStreaks(true);
    try {
      const response = await fetch("/api/post/streak");
      if (!response.ok) {
        throw new Error("Failed to fetch ongoing streaks");
      }
      const data = await response.json();
      setStreaks(data);
      // toast({
      //   title: "Success",
      //   description: "Ongoing streaks fetched successfully!",
      //   variant: "default",
      // });
    } catch (err) {
      console.error("Error fetching streaks:", err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch streaks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingStreaks(false);
    }
  };

  useEffect(() => {
    fetchCheckIns();
    fetchStreaks();
  }, []);

  return (
    <CheckInContext.Provider
      value={{
        todayPosts,
        yesterdayPosts,
        loadingCheckIns,
        loadingStreaks,
        error,
        feed,
        streaks,
        fetchCheckIns,
        checkInLoading,
      }}
    >
      {children}
    </CheckInContext.Provider>
  );
};

export const useCheckIn = () => {
  return useContext(CheckInContext);
};
