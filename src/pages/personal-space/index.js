import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Camera, Trash, Edit2, X, Save } from "lucide-react";
import ProfilePicture from "@/components/ProfilePic";
import { useSession } from "next-auth/react";
import PostsSection from "@/components/PostSection";

export default function PersonalSpace() {
  const router = useRouter();
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
  const [activeTab, setActiveTab] = useState("public");

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
      console.log(data);
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          profilePicture: imageUrl,
        }),
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
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...editedProfile,
        }),
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

  // const publicPosts = profile.publicPosts.filter((post) => post.visibility === 'PUBLIC');
  // const privatePosts = profile.privatePosts.filter((post) => post.visibility === 'PRIVATE');

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <ProfilePicture profile={profile} />
            <div className="absolute -bottom-2 right-0 flex gap-2">
              <label className="cursor-pointer p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadLoading}
                />
                <Camera className="h-4 w-4 text-gray-600" />
              </label>
              {profile.profilePicture && (
                <button
                  onClick={handleDeleteImage}
                  disabled={uploadLoading}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </button>
              )}
            </div>
          </div>
          {/*  */}
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col lg:flex-row  gap-4">
              <div className="flex items-center gap-2">
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
                    className="text-2xl font-bold border rounded px-2 py-1"
                  />
                ) : (
                  <h1 className="text-2xl text-black font-bold">
                    {profile?.name ?? "unknown"}
                  </h1>
                )}
                {profile?.isVerified && (
                  <svg
                    className="w-4 h-4 text-blue-500 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                  </svg>
                )}
              </div>
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
                className="mt-1 border rounded px-2 py-1 w-full max-w-sm"
              />
            ) : (
              <p className="text-gray-600 mt-1">{profile.email}</p>
            )}
            <div className="flex justify-center items-center">
              <button
                onClick={() => {
                  if (isEditing) {
                    handleProfileUpdate();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className="flex md:items-start md:justify-start   items-center justify-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </>
                )}
              </button>
            </div>
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

        <PostsSection profile={profile} />
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="flex items-center gap-2">
      <span className="lg:text-2xl text-xl">{icon}</span>
      <div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <p className="lg:text-lg text-sm font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

export const PostCard = ({ post }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="mt-2 lg:text-base text-sm text-gray-800">{post.content}</p>
    <div className="flex justify-between items-center mt-2">
      <span className="text-xs text-gray-600">
        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
      </span>
    </div>
  </div>
);

export const LoadingState = () => (
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
