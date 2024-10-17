"use client"
import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"
import Button from "@/components/Buttons"
import MobileHamburger from "@/components/MobileHamburger"
import DropDown from "./DropDown"

export default function ProfileHeader() {
  const { data: session } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  return (
    <header className="fixed top-0 z-50 w-full shadow-md bg-white">
      <div className="flex py-4 nav-wrapper gap-4 lg:gap-6 justify-between items-center">
        <Link href="/">
          <Image
            width={24}
            height={24}
            alt="Home"
            src="/check.svg"
            className="w-6 h-6 object-cover"
          />
        </Link>

        <div className="flex items-center gap-7">
          {session && (
            <>
              <Image
                width={32}
                height={32}
                alt={session?.user?.name || "User"}
                src={session?.user?.image || "/no-user.png"}
                className="w-8 h-8 ring-1 rounded-full"
              />

              <div className="relative hidden lg:block">
                <Button
                  onClick={toggleDropdown}
                  className="bg-gray-300 hover:bg-gray-400 text-black text-xs lg:text-sm py-3 lg:px-8 px-5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={session?.user?.name || "Profile"}
                />
                {isDropdownOpen && <DropDown />}
              </div>

              <MobileHamburger
                isOpen={isMobileMenuOpen}
                toggleMenu={toggleMobileMenu}
              />
            </>
          )}
        </div>
      </div>
      {session && isMobileMenuOpen && (
        <ul className="fixed z-30 top-0 left-0 h-full w-64 bg-white shadow-lg p-6 transition-transform transform lg:hidden">
          <li className="mb-4">
            <Link
              href="/profile/edit"
              onClick={toggleMobileMenu}
              className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Edit Profile
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href="/feed"
              onClick={toggleMobileMenu}
              className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Feed
            </Link>
          </li>
          <li
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-lg font-medium text-slate-700 hover:text-red-500 cursor-pointer transition-colors"
          >
            Sign Out
          </li>
        </ul>
      )}
    </header>
  )
}
