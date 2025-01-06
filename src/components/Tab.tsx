import Image from "next/image";
import { useRouter } from "next/router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import icons from "constants/icons";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

const TabIcon = ({ focused, icon, title }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src={icon}
        width={20}
        height={20}
        alt={title}
        className={`${
          focused ? "opacity-100" : "opacity-50"
        } dark:invert transition-opacity`}
      />
      <span
        className={`text-[10px] hidden md:block mt-0.5 ${
          focused
            ? "text-primary font-medium"
            : "text-muted-foreground"
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
        title: "Sign in required",
        description: "Please sign in to view your profile",
        variant: "destructive",
        action: (
          <button
            onClick={() => router.push("/auth/login")}
            className="rounded-full bg-primary px-4 py-1 text-xs text-primary-foreground"
          >
            Sign in
          </button>
        ),
      });
      return;
    }
    router.push(value);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="safe-area-bottom bg-background/80 backdrop-blur-lg border-t border-border">
        <Tabs
          defaultValue={router.pathname}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-full h-14 grid grid-cols-4 bg-transparent gap-1 p-0">
            {[
              { path: "/", title: "Home", icon: icons.home },
              { path: "/streaks", title: "Streaks", icon: icons.people },
              { path: "/feed", title: "Feed", icon: icons.search },
              { path: "/profile", title: "Profile", icon: icons.person },
            ].map((tab) => (
              <TabsTrigger
                key={tab.path}
                value={tab.path}
                className="data-[state=active]:bg-transparent hover:bg-accent/50 rounded-lg transition-colors"
              >
                <TabIcon
                  title={tab.title}
                  icon={tab.icon}
                  focused={router.pathname === tab.path}
                />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}