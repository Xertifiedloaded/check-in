'use client'

import { useEffect } from "react";

export default function Scheduler() {
    useEffect(() => {
      const startScheduler = async () => {
        await fetch('/api/notification');
      };
      startScheduler();
    }, []);
  
    return null; 
  }