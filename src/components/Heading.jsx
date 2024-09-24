import React from "react";
import Button from "./Buttons";
export default function Heading() {
  return (
    <section className="nav-wrapper grid justify-items-center ">
      <div>
        <div>
          <h1 class="mt-5 text-4xl font-bold leading-tight tracking-tight text-center text-slate-800 sm:text-5xl md:text-7xl">
            Daily Check-In
          </h1>
        </div>
        <form action="">
          <label htmlFor="working w-full">
            <p class="w-full   mt-10 mb-3 text-center text-sm  text-slate-500">
              Stay on track, achieve your goals, and beat procrastination
              together!
            </p>
            <textarea
              className="resize-none border-2 outline-none block w-full placeholder:text-xs shadow-sm h-[120px] p-4 rounded-lg border-gray-200"
              name=""
              id="working"
              placeholder="what are you working on today?"
            ></textarea>
          </label>
          <div className="text-center mt-10">
            <Button
              className=" bg-blue-700 px-24 text-sm ring-4 py-4 font-medium rounded-[25px] text-white"
              value="Check-In"
            />
          </div>
        </form>
      </div>
    </section>
  );
}
