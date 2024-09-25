import React from "react"
import Image from "next/image"
import Button from "@/components/Buttons"
import Link from "next/link"
import { MdNavigation } from "react-icons/md"
export default function UserHeader({ user }) {
  return (
    <section>
      <div className="flex nav-wrapper border-b   justify-between items-center">
        <div className="flex items-center my-8 gap-4 lg:gap-6">
          <Link href="/">
            <Image
              width={200}
              className="w-6 h-6 object-cover"
              height={200}
              alt="check"
              src="/check.svg"
            />
          </Link>
          <Button
            className="bg-[#e2e8f099] hidden lg:block  text-lightGray text-sm py-2 px-6 rounded-[25px]"
            value="Home"
          />
          <Button
            className="bg-[#e2e8f099] block lg:hidden  text-lightGray text-sm py-2 px-4 rounded-[25px]"
            value={<MdNavigation />}
          />
          <Button
            className="bg-[#e2e8f099] hidden lg:block   text-lightGray text-sm py-2 px-4 rounded-[25px]"
            value="News Feed"
          />
        </div>
        <div className="flex items-center gap-6">
          <Link href="/profile/edit">
            <Button
              className="bg-gray-800 text-white text-sm py-3 px-10 rounded-[25px]"
              value="DashBoard"
            />
          </Link>
          <Image
            className="w-10 h-10 ring-1 rounded-full"
            src={user.profilePicture || "/no-user.png"}
            alt="profile"
            width={200}
            height={200}
          />
        </div>
      </div>
    </section>
  )
}
