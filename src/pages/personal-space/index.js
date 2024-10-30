import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Edit2, X, Save } from "lucide-react";

import { useSession } from "next-auth/react";
import PostsSection from "@/components/PostSection";
import { DashboardPic } from "@/components/ProfilePic";
import EditDeletePost from "@/components/EditDeleteCheckin";

export default function PersonalSpace() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const CLOUDINARY_UPLOAD_PRESET = "iboyi7t9";
  const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/dpn9svwqm/image/upload`;

  useEffect(() => {
    if (!userId) return;
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (profile) {
      setEditedProfile({
        name: profile.name,
        email: profile.email,
      });
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/user/profile/userinfo?userId=${userId}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProfile(data.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      const imageUrl = data.secure_url;
      await updateProfilePicture(imageUrl);
      await fetchProfile();
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to upload image");
    } finally {
      setUploadLoading(false);
    }
  };

  const updateProfilePicture = async (imageUrl) => {
    try {
      const response = await fetch(`/api/user/profile/userinfo`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, profilePicture: imageUrl }),
      });
      if (!response.ok) throw new Error("Failed to update profile picture");
    } catch (err) {
      console.error("Error updating profile picture:", err);
      alert("Failed to update profile picture");
    }
  };

  const handleDeleteImage = async () => {
    if (!confirm("Are you sure you want to delete your profile picture?"))
      return;
    try {
      setUploadLoading(true);
      const response = await fetch(`/api/user/profile/userinfo`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to delete image");
      await fetchProfile();
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Failed to delete image");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/profile/userinfo`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...editedProfile }),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      await fetchProfile();
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return null;
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl  mx-auto ">
        <div className="bg-white   overflow-hidden">
          <div
            style={{
              backgroundImage: `url(${profile.profilePicture})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="relative h-48  "
          >
            <div className="absolute inset-0 opacity-20 bg-pattern"></div>
            <div className="absolute -bottom-20 left-8 z-10">
              <div className="relative">
                <DashboardPic
                  handleDeleteImage={handleDeleteImage}
                  handleImageUpload={handleImageUpload}
                  uploadLoading={uploadLoading}
                  profile={profile}
                />
              </div>
            </div>
          </div>

          <div className="pt-24 px-4 md:px-8 lg:px-2 pb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="text-2xl font-bold px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profile?.name ?? "Unknown"}
                      {profile?.isVerified && (
                        <span className="inline-block ml-2">
                          <svg
                            className="w-6 h-6 text-blue-500 fill-current"
                            viewBox="0 0 24 24"
                          >
                            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                          </svg>
                        </span>
                      )}
                    </h1>
                  )}
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) =>
                      setEditedProfile((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full max-w-md px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-600">{profile.email}</p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (isEditing) {
                      handleProfileUpdate();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <StatCard
                title="Current Streak"
                value={`${profile.currentStreak} days`}
                icon="🔥"
                className="bg-gradient-to-br from-amber-50 to-orange-50"
              />
              <StatCard
                title="Total Posts"
                value={profile.totalPosts}
                icon="📝"
                className="bg-gradient-to-br from-emerald-50 to-teal-50"
              />
              <StatCard
                title="Last Check-in"
                value={
                  profile?.lastCheckIn
                    ? new Date(profile.lastCheckIn).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )
                    : "No check-ins yet"
                }
                icon="📅"
                className="bg-gradient-to-br from-purple-50 to-pink-50"
              />
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Recent Posts
              </h2>
              <div className="space-y-6">
                <PostsSection profile={profile} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon, className = "" }) => (
  <div
    className={`rounded-xl p-6 transition-all duration-200 hover:shadow-md ${className}`}
  >
    <div className="flex items-center gap-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  </div>
);

export const PostCard = ({
  post,
  handlePostDelete,
  setPrivatePosts,
  setPublicPosts,
}) => {
  const parseContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    const urls = content.match(urlRegex) || [];

    const result = [];
    parts.forEach((part, index) => {
      result.push(part);
      if (urls[index]) {
        result.push(urls[index]);
      }
    });

    return result;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 lg:text-sm text-[14px] hover:shadow-md transition-shadow duration-200">
      <p className="text-gray-800">
        {parseContent(post.content).map((part, index) => {
          if (part.match(/^https?:\/\//)) {
            return (
              <a
                key={index}
                href={part}
                className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {part}
              </a>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </p>
      <div className="flex justify-between items-center mt-4">
        <div className="text-xs text-gray-600">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        <EditDeletePost
          setPrivatePosts={setPrivatePosts}
          setPublicPosts={setPublicPosts}
          handlePostDelete={handlePostDelete}
          post={post}
        />
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <div className="relative h-12 w-12">
      <div className="absolute animate-ping h-full w-full rounded-full bg-blue-400 opacity-75"></div>
      <div className="relative rounded-full h-12 w-12 bg-blue-500"></div>
    </div>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <X className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  </div>
);
