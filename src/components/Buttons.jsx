import React from "react"

export default function Button({disabled,onClick,type, className, value }) {
  return (
    <button disabled={disabled} onClick={onClick} type={type} className={className}>
      {value}
    </button>
  )
}
