import React from "react"
import Link from "next/link"
import Image from "next/image"
export default function DropDown() {
  return (
    <>
      <div class="p-4 absolute w-full pt-0 mt-1 space-y-3 text-gray-600 bg-whitesm:p-2 sm:space-y-0.5 sm:border sm:shadow-md sm:rounded-lg border-gray-200/70 ">
        <a
          href="https://dailycheckin.dev/profile/edit"
          class="relative flex cursor-pointer  select-none  items-center rounded-full py-2 px-4 sm:px-2.5 sm:py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
            <Image
              width={200}
              className="w-4 h-4 object-cover"
              height={200}
              alt="check"
              src="/user.svg"
            />
          <span className="ml-3">Edit Profile</span>
        </a>
        <form method="POST" action="" class="w-full">
          <input
            type="hidden"
            name="_token"
            value="Ol7s4mJscXD2938d9przekE6BFZaOfxduhepVZPD"
            autocomplete="off"
          />
          <button
            onClick={() => signOut()}
            class="relative w-full flex cursor-pointer hover:text-gray-700  select-none hover:bg-gray-100/70 items-center rounded-full py-2 px-4 sm:px-2.5 sm:py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            <Image
              width={200}
              className="w-4 h-4 object-cover"
              height={200}
              alt="check"
              src="/logout.svg"
            />

            <span  className="ml-3">Log out</span>
          </button>
        </form>
      </div>
    </>
  )
}
