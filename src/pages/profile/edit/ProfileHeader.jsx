import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { FaLightbulb } from "react-icons/fa"
import Button from "@/components/Buttons"
import { signOut, useSession } from "next-auth/react"
import MobileHamburger from "@/components/MobileHamburger"
export default function ProfileHeader() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <header className="   ">
      <div className="flex my-8 nav-wrapper gap-4 lg:gap-6   justify-between items-center">
        <Link href="/">
          <Image
            width={200}
            className="w-6 h-6 object-cover"
            height={200}
            alt="check"
            src="/check.svg"
          />
        </Link>

        <div className="flex justify-start gap-7 items-center">
          <Image
            width={200}
            className="w-4 h-4 object-cover"
            height={200}
            alt="check"
            src="/bulb.svg"
          />
          <Button
            className="bg-gray-300 hidden lg:block hover:bg-gray-400  text-black hover:border-gray-400 transition-all ease-in-out duration-300 text-xs lg:text-sm py-3 lg:px-8 px-5 rounded-[25px] focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-400 disabled:cursor-not-allowed"
            value={session?.user?.name}
          />
          <MobileHamburger isOpen={isOpen} toggleMenu={toggleMenu} />
        </div>
      </div>

      {session && isOpen && (
        <ul className="nav-wrapper lg:hidden z-30 h-[200px] fixed p-1 bg-white w-full ">
          <Link
            onClick={toggleMenu}
            href="/"
            className="my-3 px-3 text-slate-500 block"
          >
            <li>Edit Profile</li>
          </Link>
          <Link
            onClick={toggleMenu}
            href="/"
            className="my-3 px-3 text-slate-500 block"
          >
            <li>Feed</li>
          </Link>
          <li onClick={() => signOut()} className="my-3  px-3 text-slate-500 block">
            Log Out
          </li>
        </ul>
      )}
    </header>
  )
}
