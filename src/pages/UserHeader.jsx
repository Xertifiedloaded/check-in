import React, { useEffect, useState } from "react"
import Image from "next/image"
import Button from "@/components/Buttons"
import Link from "next/link"
import MobileHamburger from "@/components/MobileHamburger"
import { signOut, useSession } from "next-auth/react"
export default function UserHeader() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen((prev) => !prev)
  }
  useEffect(() => {
    const handleOverflow = () => {
      if (isOpen) {
        window.document.body.style.overflow = "hidden"
      } else {
        window.document.body.style.overflow = "auto"
      }
    }

    handleOverflow()
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        window.document.body.style.overflow = "auto"
        setIsOpen(false)
      } else {
        handleOverflow()
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      window.document.body.style.overflow = "auto"
    }
  }, [isOpen])
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

          <MobileHamburger isOpen={isOpen} toggleMenu={toggleMenu} />
          {session && (
            <Button
              className="bg-[#e2e8f099] hidden lg:block   text-lightGray text-sm py-2 px-4 rounded-[25px]"
              value="News Feed"
            />
          )}
        </div>
        <div className="flex items-center gap-6">
          <Link href="/profile/edit">
            <Button
              className="bg-gray-800 text-xs text-white lg:text-sm py-3 lg:px-10 px-7 rounded-[25px]"
              value="DashBoard"
            />
          </Link>
          <Image
            className="w-10 h-10 ring-1 rounded-full"
            src={session?.user?.image || "/no-user.png"}
            alt="profile"
            width={200}
            height={200}
          />
        </div>
      </div>
      {session && isOpen && (
        <ul className="nav-wrapper fixed p bg-white w-full ">
          <Link
            onClick={toggleMenu}
            href="/"
            className="my-3 px-2 text-slate-500 block"
          >
            <li>Home</li>
          </Link>
          <Link
            onClick={toggleMenu}
            href="/"
            className="my-3  px-2 text-slate-500 block"
          >
            <li>Feed</li>
          </Link>
        </ul>
      )}
    </section>
  )
}
