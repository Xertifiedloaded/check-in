import React from "react"
import Image from "next/image"
import Link from "next/link"


export default function Card({ id, name, profilePicture, streak }) {
  return (
    <Link
      href={`/user/${id}`}
      className="relative shadow-md border rounded-md bg-white my-3 flex flex-col justify-center items-center p-6"
    >
      <Image
        src={profilePicture || '/no-user-pic.png'}
        width={200}
        className="w-[50px] h-[50px] rounded-full"
        height={200}
        alt={name}

      />
      <h1 className="mt-3 text-sm font-medium">{name}</h1>

      {streak > 1 && (
        <div className="text-xs justify-center absolute w-[20px] h-[20px] right-1 top-1 rounded-full bg-[#FFCE51] text-white flex items-center space-x-1">
          <Image
            src="/flame.svg"
            width={200}
            className="w-[15px] h-[15px]"
            height={200}
            alt="Flame icon"
          />
        </div>
      )}
    </Link>
  )
}

export function StreakCard({ name, profilePicture, streak }) {
  return (
    <div className="flex mb-3 justify-between items-center">
      <div className="flex justify-between items-center gap-10">
        <Image
          src={profilePicture || "/no-user.png"}
          width={200}
          className="w-[30px] h-[30px] rounded-full"
          height={200}
          alt="img"
        />
        <h1 className="mt-3 text-xs md:text-sm  font-semibold">{name}</h1>
      </div>

      <div class="text-xs rounded-full bg-[#FFCE51] text-white lg:px-2 px-2 py-1 flex items-center space-x-1">
        <Image
          src={"/flame.svg"}
          width={200}
          className="md:w-[15px] w-[12px] h-[12px] md:h-[15px]"
          height={200}
          alt="img"
        />
        <small class="text-orange-700 text-[9px] md:text-sm  font-semibold">
          {streak} Day{streak > 1 && "s"}
        </small>
      </div>
    </div>
  )
}

export function FeedUserCard({_id,
  message,
  date,
  userId: {  name, profilePicture },}) {
  return (
    <div
      key={_id}
      className="checkin border rounded-lg shadow-md py-8 px-5 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center justify-start gap-4 mb-3">
          <Image
            src={profilePicture || "/no-user.png"}
            width={200}
            className="w-[30px] h-[30px] rounded-full"
            height={200}
            alt={name}
          />
          <p className="capitalize">{name}</p>
        </div>
        <div class="flex space-x-2 items-center text-gray-500 dark:text-gray-400">
          <Image
            src={"/calender.svg"}
            width={200}
            className="w-[20px] h-[20px] rounded-full"
            height={200}
            alt={name}
          />
          <span class="text-sm"> {date}</span>
        </div>
      </div>

      <p className="text-gray-800">{message}</p>
    </div>
  )
}
export function FeedDataCard({ userId, userName, profilePicture, message, date }) {
  return (
    <div
      key={userId}
      className="checkin border rounded-lg shadow-md py-8 px-5 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center justify-start gap-4 mb-3">
          <Image
            src={profilePicture || "/no-user-pic.png"}
            width={200}
            className="w-[30px] h-[30px] rounded-full"
            height={200}
            alt={userName}
          />
          <p className="capitalize">{userName}</p>
        </div>
        <div class="flex space-x-2 items-center text-gray-500 dark:text-gray-400">
          <Image
            src={"/calender.svg"}
            width={200}
            className="w-[20px] h-[20px] rounded-full"
            height={200}
            alt={name}
          />
          <span class="text-sm"> {date}</span>
        </div>
      </div>

      <p className="text-gray-800">{message}</p>
    </div>
  )
}
