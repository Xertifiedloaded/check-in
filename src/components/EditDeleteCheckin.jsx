import React, { useState, useEffect } from "react";
import axios from "axios";
import EditPostModal from "./Modal"; 
import { useSession } from "next-auth/react";

export default function EditDeletePost({ post }) {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isModalOpen, setModalOpen] = useState(false)
    const [currentPost, setCurrentPost] = useState(null)
  
    const { data: session, status } = useSession();
    const userId = session?.user?.id;


  

  return (
    <section>
      <div className="flex text-xs items-center gap-2">
        <button
          className={`cursor-pointer text-red-600 hover:text-red-800 disabled:opacity-50 
            ${loading ? "opacity-50" : ""}`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Deleting...
            </span>
          ) : (
            "Delete"
          )}
        </button>
        <button
          className="cursor-pointer text-blue-600 hover:text-blue-800 disabled:opacity-50"
          disabled={loading}
        >
          Edit
        </button>
      </div>

      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}

    </section>
  );
}
