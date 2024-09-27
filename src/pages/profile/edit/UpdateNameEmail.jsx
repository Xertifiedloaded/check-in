import Button from "@/components/Buttons"
import Input from "@/components/Input"
import { useSession } from "next-auth/react";
import React, { useState,useEffect } from "react"


export default function UpdateProfileNameAndEmail() {
  const [payload, setPayload] = useState({
    name: "",
    email: "",
  })

  const { data: session, status } = useSession();
  const userId=session?.user?.id 
  
  useEffect(() => {
    if (status === "authenticated") {
      setPayload({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [status, session]);


  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return; 

      try {
        const response = await axios.get(`/api/user/${userId}`); // Fetch user by ID
        const { name = "", email = "" } = response.data; 
        setPayload({ name, email });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("User ID not found.");
      return; 
    }
    try {
      await axios.patch(`/api/user/${userId}`, {
        newName: payload.name,
        newEmail: payload.email,
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile: " + error.response?.data?.message || "An unexpected error occurred.");
    }
  };


  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this account? This action cannot be undone.")) {
      try {
        await axios.delete(`/api/user/${userId}`); 
        alert("Account deleted successfully!");
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  return (
    <form className="my-4">
      <div className="w-full lg:w-[60%]">
        {Object.keys(payload).map((fieldName) => (
          <Input
            key={fieldName}
            payload={payload}
            fieldName={fieldName}
            handleChange={handleChange}
            className="appearance-none flex w-full h-10  px-3 py-2 text-sm bg-white  border rounded-md border-gray-300  ring-offset-background placeholder:text-gray-500  focus:border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-200/60  disabled:cursor-not-allowed disabled:opacity-50 "
          />
        ))}
      </div>
      <div className="mb-2">
        <Button
          type="submit"
          value="Update"
          className="px-4 py-2  text-sm font-medium rounded-full bg-gray-800  text-white hover:bg-gray-900  dark:focus:ring-gray-100   focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 cursor-pointer inline-flex items-center  justify-center disabled:opacity-50  focus:outline-none"
        />
      </div>
    </form>
  )
}
