import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export const useNotification = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotificationStatus = async () => {
      try {
        const response = await axios.get("/api/user/notification");
        setNotificationsEnabled(response.data.notificationsEnabled);
      } catch (error) {
        console.error("Error fetching notification status:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch notification settings. Please refresh the page.",
        });
      } finally {
        setFetching(false);
      }
    };

    fetchNotificationStatus();
  }, [toast]);

  const toggleNotification = async () => {
    setLoading(true);

    try {
      const response = await axios.put("/api/user/notification", {
        notificationsEnabled: !notificationsEnabled,
      });

      if (response.data.success) {
        setNotificationsEnabled(!notificationsEnabled);
        toast({
          title: "Success",
          description: `Notifications ${!notificationsEnabled ? "enabled" : "disabled"} successfully`,
        });
      }
    } catch (error) {
      console.error("Error updating notification status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    notificationsEnabled,
    loading,
    fetching,
    toggleNotification,
  };
};
