import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Camera, X, ArrowUp, ArrowDown } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { userId } = router.query;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/user/profile/${userId}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProfile(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!userId) return null;
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!profile) return <div className="text-center p-4">No profile found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-6">
        <ProfileHeader profile={profile} />
        <StatsSection profile={profile} />
        <PostsList profile={profile} posts={profile.recentPosts} />
      </div>
    </div>
  );
}

const ProfileHeader = ({ profile }) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const [imagePosition, setImagePosition] = useState("center");

  return (
    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
      <div className="relative group">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden">
          <Image
            src={profile?.profilePicture ?? "/no-user-pic.png"}
            alt={profile?.name ?? "Profile"}
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setShowFullImage(true)}
            className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all"
          >
            <Camera className="text-white opacity-0 group-hover:opacity-100 transition-all" />
          </button>
        </div>
      </div>

      <div className="text-center sm:text-left flex-1">
        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {profile.name ?? "Unknown"}
          </h1>
          {profile.isVerified && (
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 text-xs rounded-full dark:bg-blue-600 dark:text-blue-200">
              Verified
            </span>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{profile.email}</p>
      </div>

      {showFullImage && (
        <ImageModal
          profile={profile}
          position={imagePosition}
          setPosition={setImagePosition}
          onClose={() => setShowFullImage(false)}
        />
      )}
    </div>
  );
};
const StatsSection = ({ profile }) => {
  const stats = [
    { label: "Streak", value: `${profile.currentStreak} days`, icon: "🔥" },
    { label: "Posts", value: profile.totalPosts, icon: "📝" },
    {
      label: "Last seen",
      value: profile?.lastCheckIn
        ? new Date(profile.lastCheckIn).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "Never",
      icon: "📅",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`p-3 rounded-lg ${
            i === 0
              ? "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-800 dark:to-pink-800"
              : i === 1
              ? "bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-800 dark:to-blue-800"
              : "bg-gradient-to-br from-yellow-50 to-red-50 dark:from-yellow-800 dark:to-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{stat.icon}</span>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const PostsList = ({ posts, profile }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
      {profile?.name}Recent Public Posts
    </h2>
    <div className="space-y-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  </div>
);

export const PostCard = ({ post }) => {
  const parseContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    const urls = content.match(urlRegex) || [];
    const result = [];
    parts.forEach((part, index) => {
      result.push(part);
      if (urls[index]) result.push(urls[index]);
    });
    return result;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 dark:border dark:border-gray-500 p-3 rounded-lg">
      <p className="text-sm text-gray-800 dark:text-gray-200 break-words">
        {parseContent(post.content).map((part, index) =>
          part.match(/^https?:\/\//) ? (
            <a
              key={index}
              href={part}
              className="text-blue-600 hover:underline break-all dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              {part}
            </a>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </p>
      <span className="block mt-2 text-xs text-gray-500 dark:text-gray-400">
        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
      </span>
    </div>
  );
};

const ImageModal = ({ profile, position, setPosition, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full">
      <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {profile?.name ?? "Profile Picture"}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => setPosition("top")}
              className={`p-1 rounded ${
                position === "top" ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPosition("center")}
              className={`p-1 rounded ${
                position === "center" ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              <div className="w-4 h-4 border-2 rounded-sm border-gray-400 dark:border-gray-600" />
            </button>
            <button
              onClick={() => setPosition("bottom")}
              className={`p-1 rounded ${
                position === "bottom" ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4">
        <Image
          src={profile?.profilePicture ?? "/no-user-pic.png"}
          alt={profile?.name ?? "Profile picture"}
          width={800}
          height={800}
          className={`w-full h-[400px] object-cover rounded-lg ${
            position === "top"
              ? "object-top"
              : position === "bottom"
              ? "object-bottom"
              : "object-center"
          }`}
        />
      </div>
    </div>
  </div>
);

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
  </div>
);

const ErrorMessage = ({ error }) => (
  <div className="text-center p-4 text-red-600 dark:text-red-400">
    <p className="font-medium">Error</p>
    <p className="text-sm">{error}</p>
  </div>
);
