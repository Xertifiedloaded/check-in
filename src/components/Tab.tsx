import Image from "next/image";
import { useRouter } from "next/router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import icons from "constants/icons";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

const TabIcon = ({ focused, icon, title }) => {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={icon}
        width={24}
        height={24}
        alt={title}
        className={`${focused ? "opacity-100" : "opacity-50"} dark:invert`}
      />
      <span
        className={`text-xs mt-1 ${
          focused
            ? "text-blue-500 dark:text-blue-400 font-medium"
            : "text-gray-600 dark:text-gray-400 text-center"
        }`}
      >
        {title}
      </span>
    </div>
  );
};

export default function TabNavigation() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const handleTabChange = (value: string) => {
    if (value === "/profile" && status !== "authenticated") {
      toast({
        title: "Not authenticated",
        description: "Please log in to access your profile.",
        variant: "destructive",
        action: (
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-black text-white rounded-[25px] text-sm px-8 py-2  w-auto"
          >
            Log in
          </button>
        ),
      });
      return;
    } else {
      router.push(value);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 min-h-[70px] w-full backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80">
      <Tabs
        defaultValue={router.pathname}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="w-full h-full grid grid-cols-4 bg-transparent">
          <TabsTrigger
            value="/"
            className="data-[state=active]:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <TabIcon
              title="Home"
              icon={icons.home}
              focused={router.pathname === "/"}
            />
          </TabsTrigger>
          <TabsTrigger
            value="/streaks"
            className="data-[state=active]:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <TabIcon
              title="Streaks"
              icon={icons.people}
              focused={router.pathname === "/streaks"}
            />
          </TabsTrigger>
          <TabsTrigger
            value="/feed"
            className="data-[state=active]:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <TabIcon
              title="Feed"
              icon={icons.search}
              focused={router.pathname === "/feed"}
            />
          </TabsTrigger>
          <TabsTrigger
            value="/profile"
            className="data-[state=active]:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <TabIcon
              title="Profile"
              icon={icons.person}
              focused={router.pathname === "/profile"}
            />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
