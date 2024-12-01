import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const UpdateProfileStreak = () => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedInDates, setCheckedInDates] = useState([]);
  const [todayCheckedIn, setTodayCheckedIn] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const [streakResponse, checkInResponse] = await Promise.all([
          axios.get("/api/user/currentstreak"),
          axios.get("/api/post/history"),
        ]);

        setCurrentStreak(streakResponse.data.currentStreak);
        setCheckedInDates(checkInResponse.data.checkedInDates);

        const today = new Date().toISOString().split("T")[0];
        setTodayCheckedIn(checkInResponse.data.checkedInDates.includes(today));

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch streak data");
        setLoading(false);
      }
    };
    fetchStreak();
  }, []);



  const customDayRender = ({ date, ...props }) => {
    const dateString = format(date, "yyyy-MM-dd");
    const today = startOfToday();
    const isCheckedIn = checkedInDates.includes(dateString);
    const isPastDay = date < today;
    const isFutureDay = date > today;

    const dayClasses = cn(
      "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out",
      {
        "bg-emerald-500 text-white font-bold shadow-md": isCheckedIn,
        "bg-rose-100 text-rose-600 line-through opacity-60":
          isPastDay && !isCheckedIn,
        "bg-gray-100 text-gray-400 cursor-not-allowed": isFutureDay,
        "bg-blue-100 text-blue-600 font-semibold":
          !isCheckedIn && !isPastDay && !isFutureDay,
        "border-2 border-blue-300":
          format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd"),
      }
    );

    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={dayClasses} {...props}>
              <span className="select-none">{date.getDate()}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="bg-gray-800 text-white rounded-md px-3 py-1.5"
          >
            <p>
              {isCheckedIn
                ? "🏆 Successfully Checked In"
                : isPastDay
                ? "❌ Missed Check-in"
                : "📅 Not Yet Checked In"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className=" py-8">
      <Card className="w-full shadow-2xl border-none">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-t-xl">
          <CardTitle className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Streak Tracker</h2>
            <div
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold",
                currentStreak > 0
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              )}
            >
              Streak: {currentStreak} Days
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 font-medium">{error}</div>
          ) : (
            <div className="space-y-6 w-full">
              {!todayCheckedIn && (
                <div className="flex justify-center">
                  <Button
                    onClick={handleCheckIn}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                  >
                    Check In Today
                  </Button>
                </div>
              )}

              <div className="w-full max-w-full overflow-x-auto">
                <Calendar
                  mode="single"
                  month={selectedMonth}
                  onMonthChange={setSelectedMonth}
                  className="w-full"
                  components={{
                    Day: customDayRender,
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateProfileStreak;
