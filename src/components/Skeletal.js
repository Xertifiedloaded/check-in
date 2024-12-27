import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
  } from "@/components/ui/card";
export const PostSkeleton = () => (
    <Card className="animate-pulse">
      <CardHeader className="bg-gray-200 dark:bg-gray-700 h-20 rounded-t-lg" />
      <CardContent className="p-4 space-y-3">
        <div className="bg-gray-200 dark:bg-gray-700 h-6 rounded" />
        <div className="bg-gray-200 dark:bg-gray-700 h-6 rounded w-3/4" />
      </CardContent>
      <CardFooter className="p-4">
        <div className="bg-gray-200 dark:bg-gray-700 h-5 rounded w-1/2" />
      </CardFooter>
    </Card>
  );
  