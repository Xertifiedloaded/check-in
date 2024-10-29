import React, { useState } from "react";
import Button from "./Buttons";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useCheckIn } from "@/context/CheckInContext";

export default function Heading() {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const { data: session } = useSession();
  const { postCheckIn } = useCheckIn();
  const userId = session?.user?.id;

  const handleClick = (e) => {
    if (!userId) {
      e.preventDefault();
      toast.warning("You need to log in to check in.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      return toast.warning("Content cannot be empty.");
    }
    postCheckIn(content, userId, visibility);
  };

  return (
    <section className="nav-wrapper grid justify-items-center">
      <div>
        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-center text-slate-800 sm:text-5xl md:text-7xl">
          Daily Check-In
        </h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="working" className="w-full">
            <p className="lg:mt-10 my-6 lg:mb-3 text-center text-xs md:text-sm text-slate-500">
              Stay on track, achieve your goals, and beat procrastination
              together!
            </p>

            <div onClick={handleClick} className="relative">
              <textarea
                className={`resize-none border-2 outline-none block w-full placeholder:text-xs shadow-sm h-[120px] p-4 rounded-lg border-gray-200 ${
                  !userId ? "cursor-not-allowed" : ""
                }`}
                id="working"
                placeholder={
                  userId
                    ? "What are you working on today?"
                    : "Log in to enable check-in."
                }
                value={content}
                onChange={(e) => userId && setContent(e.target.value)}
                disabled={!userId}
              ></textarea>
              {!userId && <div className="absolute inset-0"></div>}
            </div>
          </label>

          <div className="mt-2 text-center">
            <select
              id="visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="mt-1 text-slate-500 bg-transparent font-medium px-3 block w-full rounded-lg border-gray-200 h-[40px] outline-none  border  shadow-sm sm:text-sm"
              disabled={!userId}
            >
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>

          <div className="text-center mt-10">
            <Button
              type="submit"
              className="bg-blue-700 px-24 text-sm ring-4 py-4 font-medium rounded-[25px] text-white"
              value="Check-In"
              disabled={!userId}
            />
          </div>
        </form>
      </div>
    </section>
  );
}
