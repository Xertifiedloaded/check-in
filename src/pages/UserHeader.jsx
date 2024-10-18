'use client'

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Menu, X, Home, Rss, Calendar, User } from "lucide-react"

export default function UserHeader() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen((prev) => !prev)
  }

  useEffect(() => {
    const handleOverflow = () => {
      document.body.style.overflow = isOpen ? "hidden" : "auto"
    }

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        document.body.style.overflow = "auto"
        setIsOpen(false)
      } else {
        handleOverflow()
      }
    }

    handleOverflow()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const NavLink = ({ href, icon: Icon, children }) => (
    <Link href={href} className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
      <Icon className="mr-3 h-5 w-5" />
      {children}
    </Link>
  )

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <Image
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                  src="/check.svg"
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
              <NavLink href="/" icon={Home}>Home</NavLink>
              {session && (
                <>
                  <NavLink href="/feed" icon={Rss}>News Feed</NavLink>
                  <NavLink href="/manage-checkin" icon={Calendar}>Manage Check-in</NavLink>
                </>
              )}
            </div>
          </div>
          <div className="hidden lg:ml-6 lg:flex lg:items-center">
            <Link href="/profile/edit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Dashboard
            </Link>
            <div className="ml-3 relative">
              <div>
                <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">View profile</span>
                  <Image
                    className="h-8 w-8 rounded-full"
                    src={session?.user?.image || "/no-user.png"}
                    alt="Profile"
                    width={32}
                    height={32}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex items-center lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink href="/" icon={Home}>Home</NavLink>
            {session && (
              <>
                <NavLink href="/feed" icon={Rss}>News Feed</NavLink>
                <NavLink href="/manage-checkin" icon={Calendar}>Manage Check-in</NavLink>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Image
                  className="h-10 w-10 rounded-full"
                  src={session?.user?.image || "/no-user.png"}
                  alt="Profile"
                  width={40}
                  height={40}
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{session?.user?.name}</div>
                <div className="text-sm font-medium text-gray-500">{session?.user?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <NavLink href="/profile/edit" icon={User}>Dashboard</NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}