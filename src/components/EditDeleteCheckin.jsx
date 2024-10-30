import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
export default function EditDeletePost({ post, handlePostDelete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);
  const [updatedContent, setUpdatedContent] = useState(post.content);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [publicPosts, setPublicPosts] = useState([]);
  const [privatePosts, setPrivatePosts] = useState([]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/user/profile/userinfo?userId=${userId}`
      );
      const data = await response.json();
      const { publicPosts, privatePosts } = data.data;
      setPublicPosts(publicPosts);
      setPrivatePosts(privatePosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setError("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(
        `/api/user/profile/delete-update-user-post?postId=${post.id}`,
        {
          data: { userId },
        }
      );
      alert("Post deleted successfully.");
      await fetchPosts()
    } catch (err) {
      console.error("Failed to delete post:", err);
      setError("Failed to delete post.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = () => {
    setCurrentPost(post);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setError(null);
  };

  const handleUpdatePost = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.put(`/api/posts/${currentPost.id}`, {
        content: updatedContent,
      });
      alert("Post updated successfully.");
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to update post:", err);
      setError("Failed to update post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex text-xs items-center gap-2">
        <button
          onClick={handleDeletePost}
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
        //   onClick={handleEditPost}
          className="cursor-pointer text-blue-600 hover:text-blue-800 disabled:opacity-50"
          disabled={loading}
        >
          Edit
        </button>
      </div>

      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md w-1/3">
            <h2 className="text-lg font-semibold mb-2">Edit Post</h2>
            <textarea
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              className="w-full border rounded p-2"
              rows="5"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleUpdatePost}
                className={`bg-blue-500 text-white py-1 px-3 rounded mr-2 ${
                  loading ? "opacity-50" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Save"}
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 py-1 px-3 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
