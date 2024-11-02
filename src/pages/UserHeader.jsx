"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Menu, X, Home, Rss, Calendar, User, LogOut, Bell } from "lucide-react";
import { signOut } from "next-auth/react";
import ThemeToggleButton from "@/components/ToggleTheme";

export default function UserHeader() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleOverflow = () => {
      document.body.style.overflow = isOpen ? "hidden" : "auto";
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        document.body.style.overflow = "auto";
        setIsOpen(false);
      } else {
        handleOverflow();
      }
    };

    handleOverflow();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const NavLink = ({ href, icon: Icon, children }) => (
    <Link
      href={href}
      className="flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
    >
      <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      <span>{children}</span>
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="relative">
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/80 dark:border-gray-800/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 dark:bg-indigo-600 blur-sm rounded-full" />
                  <Image
                    width={32}
                    height={32}
                    className="relative h-8 w-auto dark:invert hover:scale-105 transition-transform duration-200"
                    src="/check.svg"
                    alt="Logo"
                  />
                </div>
              </Link>
              
              <div className="hidden lg:flex lg:items-center lg:space-x-1">
                <NavLink href="/feed" icon={Rss}>
                  Feed
                </NavLink>
                <NavLink href="/manage-checkin" icon={Calendar}>
                  Check-in
                </NavLink>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              <ThemeToggleButton />
              
              <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                <Bell className="w-5 h-5" />
              </button>
              <Link
                href="/personal-space"
                className="hidden lg:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 rounded-full shadow-sm hover:from-indigo-600 hover:to-indigo-700 dark:hover:from-indigo-500 dark:hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
              >
                Dashboard
              </Link>
              <div className="hidden lg:flex lg:items-center lg:space-x-2">
                <div className="flex items-center space-x-3 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                  <Image
                    className="h-7 w-7 rounded-full ring-2 ring-white dark:ring-gray-700"
                    src={session?.user?.image || "/no-user.png"}
                    alt="Profile"
                    width={28}
                    height={28}
                  />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <span className="sr-only">Open menu</span>
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="relative lg:hidden">
            <div className="absolute inset-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="px-4 py-3 space-y-1">
                <NavLink href="/" icon={Home}>
                  Home
                </NavLink>
                <NavLink href="/feed" icon={Rss}>
                  Feed
                </NavLink>
                <NavLink href="/manage-checkin" icon={Calendar}>
                  Check-in
                </NavLink>
                <NavLink href="/personal-space" icon={User}>
                  Dashboard
                </NavLink>
              </div>
              
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <Image
                    className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-700"
                    src={session?.user?.image || "/no-user.png"}
                    alt="Profile"
                    width={40}
                    height={40}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {session?.user?.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {session?.user?.email}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="mt-3 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 rounded-full hover:from-indigo-600 hover:to-indigo-700 dark:hover:from-indigo-500 dark:hover:to-indigo-600 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}