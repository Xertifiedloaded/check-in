import React from "react";
import Image from "next/image";
export default function Card({name}) {
  return (
    <div className="shadow-md border rounded-md  bg-white my-3 flex flex-col justify-center items-center p-6">
      <Image
        src="/test.jpeg"
        width={200}
        className="w-[50px] h-[50px] rounded-full"
        height={200}
        alt="img"
      />
      <h1 className="mt-3 text-sm font-medium">{name}</h1>
    </div>
  );
}

export function StreakCard() {
  return (
    <div className="flex mb-3 justify-between items-center">
      <div className="flex justify-between items-center gap-10">
        <Image
          src="/test.jpeg"
          width={200}
          className="w-[30px] h-[30px] rounded-full"
          height={200}
          alt="img"
        />
        <h1 className="mt-3 text-sm font-medium">Olaitan</h1>
      </div>

      <div class="text-xs rounded-full bg-[#FFCE51] text-white px-2 py-1 flex items-center space-x-1">
      <Image
          src="/flame.svg"
          width={200}
          className="w-[15px] h-[15px]"
          height={200}
          alt="img"
        />
        <span class="text-orange-700  font-semibold">1 day</span>
      </div>
    </div>
  );
}
