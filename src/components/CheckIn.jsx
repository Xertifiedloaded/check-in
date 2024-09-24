import React from "react";
import Card, { StreakCard } from "./Card";

export default function CheckIn() {
  return (
    <section className="nav-wrapper mt-20 gap-6 flex flex-col lg:flex-row">
      <div className="flex flex-col w-full lg:w-[70%] space-y-6">
        <div>
          <h1 className="text-xl font-bold mb-4 border-b pb-3">Today</h1>
          <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-4 gap-2">
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <Card key={index} />
              ))}
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold mb-4 border-b pb-3">Yesterday</h1>
          <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-2">
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <Card key={index} />
              ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[30%]">
        <h1 className="text-xl font-bold mb-4 border-b pb-3">Streak</h1>
        {Array(4)
              .fill(null)
              .map((_, index) => (
                <StreakCard key={index} />
              ))}
      </div>
    </section>
  );
}
