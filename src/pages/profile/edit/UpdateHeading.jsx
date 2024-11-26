import React from "react"

export default function UpdateHeading({ heading, paragraph }) {
  return (
    <div>
      <h1 className=" text-black dark:text-white my-2">{heading}</h1>
      <p className="text-lightGray text-sm">{paragraph}</p>
    </div>
  )
}
