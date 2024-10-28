import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import ProfilePicture from "@/components/ProfilePic";

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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setProfile(data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!userId) return null;
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* <div className="relative  rounded-full">
            <Image
              src={profile?.profilePicture ?? "/no-user-pic.png"}
              alt={profile?.name}
              width={128}
              height={128}
              className="rounded-full  object-cover"
            />
          </div> */}
          <ProfilePicture profile={profile} />
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl text-black font-bold">
                {profile.name ?? "unknown"}
              </h1>
              {profile.isVerified && (
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                  Verified
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <StatCard
            title="Current Streak"
            value={`${profile.currentStreak} days`}
            icon="🔥"
          />
          <StatCard title="Total Posts" value={profile.totalPosts} icon="📝" />
          <StatCard
            title="Last Check-in"
            value={
              profile?.lastCheckIn
                ? formatDistanceToNow(new Date(profile.lastCheckIn), {
                    addSuffix: true,
                  })
                : "No check-ins yet"
            }
            icon="📅"
          />
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
          <div className="space-y-4">
            {profile?.recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="flex items-center gap-2">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

const PostCard = ({ post }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-gray-800">{post.content}</p>
    <div className="flex justify-between items-center mt-2">
      <span className="text-sm text-gray-600">
        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
      </span>
      <span className="text-sm text-gray-600">
        {post.comments.length} comments
      </span>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="text-red-500 text-center">
      <h2 className="text-xl font-bold">Error</h2>
      <p>{error}</p>
    </div>
  </div>
);
