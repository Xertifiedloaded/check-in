

import React from 'react';
import { User, Calendar, Activity, MessageCircle, ThumbsUp } from 'lucide-react';

const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    profilePicture: "https://via.placeholder.com/150", // Placeholder image URL
    isVerified: true,
    createdAt: "2022-01-01T00:00:00Z",
    streaks: [
      {
        lastCheckIn: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // Active streak (last check-in within 24 hours)
        currentStreak: 5,
      },
    ],
    posts: [
      {
        id: 1,
        content: "This is my first post!",
        createdAt: "2023-10-01T00:00:00Z",
        likes: [1, 2, 3], // Simulating 3 likes
        _count: {
          comments: 2, // Simulating 2 comments
        },
      },
      {
        id: 2,
        content: "Had a great day today!",
        createdAt: "2023-10-02T00:00:00Z",
        likes: [1], // Simulating 1 like
        _count: {
          comments: 1, // Simulating 1 comment
        },
      },
    ],
  };
  



const UserDashboard = () => {
  const lastCheckIn = user?.streaks[0]?.lastCheckIn;
  const isStreakActive = lastCheckIn ? 
    (Date.now() - new Date(lastCheckIn).getTime()) < 24 * 60 * 60 * 1000 : 
    false;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={48} className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              {user?.isVerified && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
              )}
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Member Since:</span>
                <span className="text-sm font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Current Streak:</span>
                <span className="text-sm font-medium">
                  {user?.streaks[0]?.currentStreak || 0} days
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <div className="flex items-center space-x-2">
              <Activity className={`w-5 h-5 ${isStreakActive ? 'text-green-500' : 'text-gray-400'}`} />
              <span className={`text-sm ${isStreakActive ? 'text-green-500' : 'text-gray-400'}`}>
                {isStreakActive ? 'Streak Active' : 'Streak Inactive'}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {user?.posts && user.posts.map((post) => (
              <div 
                key={post.id} 
                className="p-4 bg-gray-50 rounded-lg"
              >
                <p className="mb-3">{post.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post._count?.comments || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {(!user.posts || user.posts.length === 0) && (
              <p className="text-center text-gray-500 py-4">
                No posts yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;