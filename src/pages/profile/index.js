import Image from "next/image";
import { Bell, Edit, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import icons from "constants/icons";
import { settings } from "constants/data";
import images from "constants/images";
import { useUserProfile } from "../../hooks/usePost";
import { signOut } from "next-auth/react";

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle = "",
  showArrow = true,
}) => {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
    >
      <div className="flex items-center">
        <Image src={icon} alt={title} width={24} height={24} className="mr-4" />
        <span className={`text-base ${textStyle}`}>{title}</span>
      </div>
      {showArrow && <ChevronRight className="text-gray-400 w-5 h-5" />}
    </button>
  );
};

export default function Profile() {
  const { profile, loading, error } = useUserProfile();

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold dark:text-white">Profile</h1>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-col items-center mt-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden">
              <Image
                src={profile?.profilePicture || images.avatar}
                alt="Profile"
                width={112}
                height={112}
                className="object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
              <Edit className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-2xl font-bold mt-4 dark:text-white">
            {profile?.name || "Loading..."}
          </h2>
        </div>

        <div className="mt-10 space-y-4">
          <SettingsItem
            icon={icons.calendar}
            title="My Bookings"
            onPress={() => console.log("Navigating to My Bookings")}
          />
          <SettingsItem
            icon={icons.wallet}
            title="Payments"
            onPress={() => console.log("Navigating to Payments")}
          />
        </div>

        <div className="mt-6 space-y-4">
          {settings.slice(2).map((item, idx) => (
            <SettingsItem
              key={idx}
              icon={item.icon}
              title={item.title}
              onPress={item.onPress}
              textStyle={item.textStyle}
              showArrow={item.showArrow}
            />
          ))}
        </div>

        <div className="mt-10">
          <SettingsItem
            icon={icons.logout}
            title="Log out"
            textStyle="text-red-500"
            onPress={() => signOut({ callbackUrl: "/auth/login" })}
          />
        </div>
      </div>
    </div>
  );
}

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-white dark:bg-gray-950">
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      <div className="flex flex-col items-center mt-8">
        <Skeleton className="w-28 h-28 rounded-full" />
        <Skeleton className="h-8 w-48 mt-4" />
      </div>

      <div className="mt-10 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  </div>
);
