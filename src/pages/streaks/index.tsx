import React from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Flame, Calendar } from 'lucide-react';
import images from 'constants/images';
import { useStreaks } from '@/hooks/usePost';

export default function LeaderBoard() {
  const { streaks = [], isLoading, error, refetch } = useStreaks();

  const activeStreaks = Array.isArray(streaks) ? streaks.filter(streak => streak?.currentStreak > 0) : [];


  const TopThreeCard = ({ streak, position }) => (
    <Card className="relative overflow-hidden transform transition-all hover:scale-105">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
      <div className="p-6 text-center">
        <div className="relative inline-block">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <Image
              src={streak?.userProfilePicture || images?.avatar}
              alt={streak?.userName || 'User'}
              fill
              className="rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
              {position === 1 && <Trophy className="w-6 h-6 text-yellow-500" />}
              {position === 2 && <Medal className="w-6 h-6 text-gray-400" />}
              {position === 3 && <Medal className="w-6 h-6 text-amber-600" />}
            </div>
          </div>
        </div>
        <h3 className="font-bold text-lg mb-1 dark:text-white">{streak?.userName || 'Anonymous'}</h3>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="text-2xl font-bold text-orange-500">{streak?.currentStreak}</span>
          <span className="text-sm text-gray-500">days</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last check-in: {streak?.lastCheckIn ? new Date(streak.lastCheckIn).toLocaleDateString() : 'Never'}
        </div>
      </div>
    </Card>
  );

  const RegularUserCard = ({ streak }) => (
    <Card className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="p-4 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14">
            <Image
              src={streak?.userProfilePicture || images?.avatar}
              alt={streak?.userName || 'User'}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold dark:text-white">{streak?.userName || 'Anonymous'}</h3>
            <p className="text-sm text-gray-500">Rank #{streak?.rank || '-'}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xl font-bold text-orange-500">{streak?.currentStreak}</span>
            </div>
            <span className="text-xs text-gray-500">days</span>
          </div>
          <div className="hidden sm:block text-right text-sm text-gray-500">
            <Calendar className="inline-block w-4 h-4 mr-1" />
            {streak?.lastCheckIn ? new Date(streak.lastCheckIn).toLocaleDateString() : 'Never'}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="wrapper min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2 dark:text-white">
            Daily Streak Leaderboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Top performers and their impressive streaks
          </p>
        </div>

        {error ? (
          <div className="max-w-md mx-auto">
            <Card className="p-6 text-center bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </Card>
          </div>
        ) : isLoading ? (
          <div className="space-y-6">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : activeStreaks.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {activeStreaks.slice(0, 3).map((streak, index) => (
                <TopThreeCard 
                  key={streak?.id || index} 
                  streak={streak} 
                  position={index + 1} 
                />
              ))}
            </div>

            <div className="space-y-4">
              {activeStreaks.slice(3).map((streak, index) => (
                <RegularUserCard 
                  key={streak?.id || `regular-${index}`} 
                  streak={streak}
                />
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No active streaks available at the moment.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}