import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useCheckIn } from "@/context/CheckInContext";
import { toast } from "react-toastify";
import { Clock, Lock, Globe, Sparkles } from "lucide-react";

export default function DailyCheckIn() {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const { data: session } = useSession();
  const { postCheckIn } = useCheckIn();
  const userId = session?.user?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      return toast.warning("You need to log in to check in.");
    }
    if (!content.trim()) {
      return toast.warning("Content cannot be empty.");
    }
    postCheckIn(content, userId, visibility);
    setContent("");
  };

  return (
<div className="max-w-2xl mx-auto">
  <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-t-2xl p-6 text-white">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <Clock className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold">Daily Check-In</h2>
      </div>
      <div className="hidden sm:block">
        <Sparkles className="w-6 h-6 text-yellow-300" />
      </div>
    </div>
    <p className="text-white/90">
      Share your daily progress and inspire others!
    </p>
  </div>

  <div className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-md p-6">
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <textarea
          placeholder={
            userId
              ? "What will you accomplish today? Share your steps, wins, big or small..."
              : "Please login to share your progress..."
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!userId}
          className={`w-full placeholder:text-sm p-4 min-h-[150px] rounded-xl border-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all duration-200
            ${
              !userId
                ? "bg-gray-50 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-white dark:bg-gray-800 hover:border-indigo-300"
            }`}
        />
        {!userId && (
          <div className="absolute inset-0 bg-gray-50/50 rounded-xl backdrop-blur-[1px] flex items-center justify-center">
            <p className="text-gray-500 font-medium bg-white px-6 py-3 rounded-full shadow-sm">
              Login required to share
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-auto">
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            disabled={!userId}
            className={`w-full sm:w-[180px] pl-10 pr-4 py-2.5 rounded-xl border-2 bg-white dark:bg-gray-700 appearance-none
              ${
                !userId
                  ? "bg-gray-50 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                  : "hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              }
              cursor-pointer`}
          >
            <option value="PUBLIC">Public Post</option>
            <option value="PRIVATE">Private Note</option>
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {visibility === "PUBLIC" ? (
              <Globe className="w-5 h-5 text-gray-500" />
            ) : (
              <Lock className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!userId || !content.trim()}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200
            ${
              !userId || !content.trim()
                ? "bg-gray-100 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
            }
            w-full sm:w-auto sm:ml-auto`}
        >
          Share Progress
        </button>
      </div>
    </form>

    <div className="mt-6 pt-6 border-t dark:border-gray-700">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
        <Sparkles className="w-4 h-4 text-yellow-500" />
        <p className="text-sm">
          Pro tip: Share specific achievements to inspire others!
        </p>
      </div>
    </div>
  </div>
</div>

  );
}