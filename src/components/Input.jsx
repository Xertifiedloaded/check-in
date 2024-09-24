import React from "react";

export default function Input({ payload, fieldName, handleChange }) {
  return (
    <div>
      <label htmlFor={fieldName} className="block text-sm font-medium">
        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} 
      </label>
      <input
        type={
          fieldName === "password" ? "password" : fieldName === "email" ? "email" : "text"
        }
        id={fieldName}
        name={fieldName}
        value={payload[fieldName]}
        onChange={handleChange}
        className="appearance-none flex w-full h-10 px-3 py-2 text-sm bg-white  border rounded-md border-gray-300  ring-offset-background placeholder:text-gray-500  focus:border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-200/60  disabled:cursor-not-allowed disabled:opacity-50 "
        placeholder={`Enter your ${fieldName}`}
      />
    </div>
  );
}
