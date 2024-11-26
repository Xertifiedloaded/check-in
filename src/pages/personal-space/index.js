import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Edit2, X, Save } from "lucide-react";

import { useSession } from "next-auth/react";
import PostsSection from "../../components/PostSection";
import { DashboardPic } from "../../components/ProfilePic";
import EditDeletePost from "../../components/EditDeleteCheckin";
import DeleteAccount from "../profile/edit/DeleteAccount";
import UpdateProfileStreak from "../profile/edit/Streak";

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

  // Image Upload Method
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

  // Update Profile Picture Method
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

  // Delete Image Method
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

  // Profile Update Method
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

  // Profile Change Handler
  const handleProfileChange = (field, value) => {
    if (field === 'isEditing') {
      setIsEditing(value);
    } else {
      setEditedProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Cancel Edit Handler
  const handleCancelEdit = () => {
    setEditedProfile({
      name: profile.name,
      email: profile.email,
    });
    setIsEditing(false);
  };

  // Loading and Error States
  if (!userId) return null;
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="overflow-hidden">
          <div
            style={{
              backgroundImage: `url(${profile.profilePicture})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="relative h-48"
          >
            <div className="absolute inset-0 opacity-20 bg-pattern"></div>
            <div className="absolute -bottom-20 left-8 z-10">
              <DashboardPic
                handleDeleteImage={handleDeleteImage}
                handleImageUpload={handleImageUpload}
                uploadLoading={uploadLoading}
                profile={profile}
              />
            </div>
          </div>

          <div className="pt-24 px-4 md:px-8 lg:px-2 pb-8">
            <div className="bg-white dark:bg-inherit shadow-sm rounded-lg  mb-6">
              <ProfileEditForm
                profile={profile}
                isEditing={isEditing}
                editedProfile={editedProfile}
                onProfileChange={handleProfileChange}
                onSave={handleProfileUpdate}
                onCancel={handleCancelEdit}
                uploadLoading={uploadLoading}
                handleImageUpload={handleImageUpload}
                handleDeleteImage={handleDeleteImage}
              />
            </div>

            <UpdateProfileStreak />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <StatCard
                title="Current Streak"
                value={`${profile.currentStreak} days`}
                icon="🔥"
                className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-800 dark:to-orange-800"
              />
              <StatCard
                title="Total Posts"
                value={profile.totalPosts}
                icon="📝"
                className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-800 dark:to-teal-800"
              />
              <StatCard
                title="Last Check-in"
                value={
                  profile?.lastCheckIn
                    ? new Date(profile.lastCheckIn).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "No check-ins yet"
                }
                icon="📅"
                className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-800 dark:to-pink-800"
              />
            </div>

            {/* Posts Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 dark:text-gray-100">
                Recent Posts
              </h2>
              <PostsSection profile={profile} />
            </div>

            {/* Delete Account */}
            <div className="mt-8">
              <DeleteAccount />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const StatCard = ({ title, value, icon, className = "" }) => (
  <div
    className={`rounded-xl p-6 transition-all duration-200 hover:shadow-md ${className} bg-white dark:bg-gray-800`}
  >
    <div className="flex items-center gap-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </h3>
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
          {value}
        </p>
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
    <div className="bg-white rounded-xl dark:border dark:border-gray-500 shadow-sm p-3 lg:text-sm text-[14px] hover:shadow-md transition-shadow duration-200 dark:bg-gray-800">
      <p className="text-gray-800 dark:text-gray-200">
        {parseContent(post.content).map((part, index) => {
          if (part.match(/^https?:\/\//)) {
            return (
              <a
                key={index}
                href={part}
                className="text-blue-600 hover:text-blue-800 hover:underline break-all dark:text-blue-400 dark:hover:text-blue-500"
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
        <div className="text-xs text-gray-600 dark:text-gray-400">
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
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
    <div className="relative h-12 w-12">
      <div className="absolute animate-ping h-full w-full rounded-full bg-blue-400 opacity-75 dark:bg-blue-600"></div>
      <div className="relative rounded-full h-12 w-12 bg-blue-500 dark:bg-blue-700"></div>
    </div>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 dark:bg-gray-800">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4 dark:bg-red-600">
          <X className="h-8 w-8 text-red-600 dark:text-red-200" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Error
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    </div>
  </div>
);


const ProfileEditForm = ({
  profile,
  isEditing,
  editedProfile,
  onProfileChange,
  onSave,
  onCancel,
  uploadLoading,
  handleImageUpload,
  handleDeleteImage
}) => {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) =>
                  onProfileChange('name', e.target.value)
                }
                className="text-2xl font-bold  dark:text-black  px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ) : (
              <h1 className="text-2xl font-bold dark:text-white text-gray-900 flex items-center">
                {profile?.name ?? "Unknown"}
                {profile?.isVerified && (
                  <span className="inline-block ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Verified
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
                onProfileChange('email', e.target.value)
              }
              className="w-full max-w-md dark:text-black px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          ) : (
            <p className="text-gray-600  dark:text-white">{profile.email}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isEditing ? (
            <div className="flex mt-4 lg:mt-0 space-x-2">
              <button 
                onClick={onSave}
                disabled={uploadLoading}
                className="flex items-center gap-2 bg-green-500 text-base  text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={onCancel}
                className="flex items-center gap-2 bg-red-500 text-base text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => onProfileChange('isEditing', true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};





