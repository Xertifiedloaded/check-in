"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const CheckInContext = createContext();

export const CheckInProvider = ({ children }) => {
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
      // if (
      //   // !data ||
      //   // !Array.isArray(data.todayPosts) ||
      //   // !Array.isArray(data.yesterdayPosts)
      // ) {
      //   console.error("Unexpected response structure:", data);
      //   return;
      // }

      // setTodayPosts(data.todayPosts);
      // setYesterdayPosts(data.yesterdayPosts);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    } catch (err) {
      console.error("Error fetching streaks:", err);
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
