import React from "react"

export default function Button({onClick,type, className, value }) {
  return (
    <button onClick={onClick} type={type} className={className}>
      {value}
    </button>
  )
}
