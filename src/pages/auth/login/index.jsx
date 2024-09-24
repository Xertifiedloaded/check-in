import Button from "@/components/Buttons";
import Input from "@/components/Input";
import Link from "next/link";
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";

export default function Login() {
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  return (
    <section className="grid h-screen place-items-center w-full">
      <div className="p-4 max-w-md w-full mx-auto">
        <div className="text-center my-5">
          <h2 class="my-4 text-2xl font-extrabold leading-9 text-center text-gray-800 ">
            Sign in to your account
          </h2>
          <p className="flex justify-center gap-3 items-center">
            <span> or</span>
            <Link
              className=" text-gray-500 underline cursor-pointer text-sm hover:text-gray-800"
              href="/auth/signup"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="space-y-4 shadow-sm border p-6 rounded-md">
          <Button
            className="flex justify-center items-center px-4 py-2 mt-5 space-x-2 text-sm font-medium text-gray-500 bg-gray-100 border rounded-md hover:text-gray-700 border-gray-200/70 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 w-full focus:ring-offset-2 focus:ring-gray-200/60 focus:shadow-outline"
            value={
              <div className="flex justify-center items-center">
                <FaGoogle className="mr-2" />
                <p className="text-black">Login With Google</p>
              </div>
            }
          />
          <Button
            className="flex justify-center items-center px-4 py-2 mt-5 space-x-2 text-sm font-medium text-gray-500 bg-gray-100 border rounded-md hover:text-gray-700 border-gray-200/70 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 w-full focus:ring-offset-2 focus:ring-gray-200/60 focus:shadow-outline"
            value={
              <div className="flex justify-center items-center">
                <FaGoogle className="mr-2" />
                <p className="text-black">Login With GitHub</p>
              </div>
            }
          />
          <fieldset className="border-t  my-4 text-center text-xs">
            <legend>or</legend>
          </fieldset>
          {Object.keys(payload).map((fieldName) => (
            <Input
              key={fieldName}
              payload={payload}
              fieldName={fieldName}
              handleChange={handleChange}
            />
          ))}

          <button
            type="submit"
            className="bg-black text-white py-2 px-4 rounded w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
