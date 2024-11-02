import React, { useState } from "react"
import Image from "next/image"
import Button from "@/components/Buttons"
import Link from "next/link"
import { MdRssFeed, MdMenu, MdClose } from "react-icons/md"
import ThemeToggleButton from "@/components/ToggleTheme"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                width={32}
                height={32}
                className="w-8 h-8 dark:invert object-contain"
                alt="check"
                src="/check.svg"
              />
              <span className="hidden sm:block font-semibold text-gray-900 dark:text-white">
                Daily Check-in
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/"
              className="px-4 py-2 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/feed"
              className="px-4 py-2 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <MdRssFeed className="w-4 h-4" />
                <span>Feed</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggleButton />
            
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/auth/login">
                <Button
                  className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm py-2 px-4 rounded-full border border-gray-300 dark:border-gray-700 transition-colors"
                  value="Login"
                />
              </Link>
              <Link href="/auth/signup">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-full transition-colors"
                  value="Sign up"
                />
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <MdClose className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <MdMenu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link 
              href="/"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/feed"
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <MdRssFeed className="w-4 h-4" />
              <span>Feed</span>
            </Link>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Link href="/auth/login">
                <Button
                  className="w-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm py-2 px-4 rounded-full border border-gray-300 dark:border-gray-700 transition-colors"
                  value="Login"
                />
              </Link>
              <Link href="/auth/signup">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-full transition-colors"
                  value="Sign up"
                />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}