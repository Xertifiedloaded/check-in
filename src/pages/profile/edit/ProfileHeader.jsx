import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { Menu, X, ChevronDown, User, LogOut, Home } from 'lucide-react';
import Button from '@/components/Buttons';
import { MdRssFeed } from "react-icons/md"
export default function ProfileHeader() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
          <Link href="/">
            <Image
              width={200}
              className="w-6 h-6 object-cover"
              height={200}
              alt="check"
              src="/check.svg"
            />
          </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {session && (
              <>
          <Link href="/feed">
          <Button
            className="bg-[#e2e8f099]  text-lightGray text-sm py-2 px-4 rounded-[25px]"
            value={<MdRssFeed />}
          />
          </Link>
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <img
                      src={session?.user?.image ?? "/no-user.png"}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                    <ChevronDown size={20} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                      <Link
                        href="/profile/edit"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <User size={16} className="mr-2" />
                        Edit Profile
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && session && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 text-sm pt-2 pb-3 space-y-1">
            <Link
              href="/feed"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <div className="flex items-center">
                <Home size={16} className="mr-2" />
                Feed
              </div>
            </Link>
            <Link
              href="/profile/edit"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                Edit Profile
              </div>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}