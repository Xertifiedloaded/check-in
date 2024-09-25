import React from "react";
import Image from "next/image";
import Button from "@/components/Buttons";
import { FaHamburger, FaMobile } from "react-icons/fa";
import { MdNavigation } from "react-icons/md";
export default function Landing() {
  return (
    <section className="flex nav-wrapper border-b   justify-between items-center">
      <div className="flex items-center my-8 gap-4 lg:gap-6">
        <Image
          width={200}
          className="w-6 h-6 object-cover"
          height={200}
          alt="check"
          src="/check.svg"
        />
        <Button
          className="bg-[#e2e8f099] hidden lg:block  text-lightGray text-sm py-2 px-6 rounded-[25px]"
          value="Home"
        />
        <Button
          className="bg-[#e2e8f099] block lg:hidden  text-lightGray text-sm py-2 px-4 rounded-[25px]"
          value={<MdNavigation/>}
        />
      </div>
      <div className="flex items-center gap-6">
        <Button
          className="bg-transparent shadow-sm border border-gray-300 text-lightGray text-sm py-2 px-6 rounded-[25px]"
          value="Login"
        />
        <Button
          className="bg-gray-800 text-white text-sm py-2 px-6 rounded-[25px]"
          value="Signup"
        />
      </div>
    </section>
  );
}
