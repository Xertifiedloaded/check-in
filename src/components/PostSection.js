import { PostCard } from "@/pages/personal-space";
import { useState } from "react";

export default function PostsSection({ profile }) {
  const [activeTab, setActiveTab] = useState("public");

  const posts = activeTab === "public" ? profile?.publicPosts : profile?.privatePosts;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Posts</h2>
      

      <div className="flex space-x-4 border-b border-gray-300 mb-4">
        <button
          onClick={() => setActiveTab("public")}
          className={`py-2 px-4 ${activeTab === "public" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-500"}`}
        >
          Public
        </button>
        <button
          onClick={() => setActiveTab("private")}
          className={`py-2 px-4 ${activeTab === "private" ? "border-b-2 border-blue-500 text-blue-500 font-semibold" : "text-gray-500"}`}
        >
          Private
        </button>
      </div>

      <div className="space-y-4">
        {posts?.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="text-gray-500">No {activeTab} posts available.</p>
        )}
      </div>
    </div>
  );
}
