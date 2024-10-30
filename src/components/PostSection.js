import { PostCard } from "@/pages/personal-space";
import axios from "axios";
import React, { useState } from "react";

const PostsSection = ({ profile }) => {
  const [activeTab, setActiveTab] = useState("public");
  const [page, setPage] = useState(1);
  const postsPerPage = 5;

  const [publicPosts, setPublicPosts] = useState(profile?.publicPosts || []);
  const [privatePosts, setPrivatePosts] = useState(profile?.privatePosts || []);


  const handlePostDelete = (postId) => {
    const postExistsInPublic = publicPosts.some((post) => post.id === postId);
    const postExistsInPrivate = privatePosts.some((post) => post.id === postId);
    if (postExistsInPublic || postExistsInPrivate) {
      setPublicPosts((prevPublicPosts) =>
        prevPublicPosts.filter((post) => post.id !== postId)
      );

      setPrivatePosts((prevPrivatePosts) =>
        prevPrivatePosts.filter((post) => post.id !== postId)
      );
    }
  };
  const tabs = [
    { id: "public", label: "Public Posts" },
    { id: "private", label: "Private Posts" },
  ];

  const getCurrentPosts = () => {
    const allPosts =
      activeTab === "public"
        ? profile?.publicPosts || []
        : profile?.privatePosts || [];

    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;

    return allPosts.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(
    (activeTab === "public"
      ? profile?.publicPosts?.length
      : profile?.privatePosts?.length || 0) / postsPerPage
  );

  return (
    <div className="mt-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Posts navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
              className={`
                py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6 space-y-6">
        {getCurrentPosts().map((post, index) => (
          <PostCard
          activeTab={activeTab}
          handlePostDelete={handlePostDelete}
            publicPosts={publicPosts}
            privatePosts={privatePosts}
            setPrivatePosts={setPrivatePosts}
            setPublicPosts={setPublicPosts}
            post={post}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2" aria-label="Pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`
                px-3 py-1 rounded-md text-sm font-medium
                ${
                  page === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              Previous
            </button>

            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`
                    px-3 py-1 rounded-md text-sm font-medium
                    ${
                      page === i + 1
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`
                px-3 py-1 rounded-md text-sm font-medium
                ${
                  page === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {getCurrentPosts().length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No posts yet
          </h3>
          <p className="text-gray-500">
            {activeTab === "public"
              ? "Start sharing your thoughts with the world!"
              : "Your private thoughts will appear here."}
          </p>
        </div>
      )}
    </div>
  );
};

export default PostsSection;