import React from "react"
import Image from "next/image"
import Button from "@/components/Buttons"
import Link from "next/link"
import { MdRssFeed } from "react-icons/md"
import ThemeToggleButton from "@/components/ToggleTheme"
export default function Header() {
  return (
    <section>
      <div className="flex nav-wrapper   justify-between items-center">
        <div className="flex items-center my-4 gap-4 lg:gap-6">
          <Link href="/">
            <Image
              width={200}
              className="w-6 h-6 object-cover"
              height={200}
              alt="check"
              src="/check.svg"
            />
          </Link>
          <ThemeToggleButton/>
          <Button
            className="bg-[#e2e8f099] hidden lg:block  text-white text-sm py-2 px-6 rounded-[25px]"
            value="Home"
          />
          <Link href="/feed">
          <Button
            className="bg-[#e2e8f099]  text-white text-sm py-2 px-4 rounded-[25px]"
            value={<MdRssFeed />}
          />
          </Link>
    
        </div>
        <div className="flex items-center gap-6">
          <Link href="/auth/login">
            <Button
              className="bg-transparent shadow-sm border border-gray-300 text-white text-sm py-2 px-6 rounded-[25px]"
              value="Login"
            />
          </Link>
          <Link href="/auth/signup">
            <Button
              className="bg-gray-800 text-white text-sm py-2 px-6 rounded-[25px]"
              value="Signup"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
