import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';

interface SearchUser {
  id: string;
  name: string;
  profilePicture: string;
}

interface PendingRequest {
  id: string;
  name: string;
  profilePicture: string;
}

export const FriendSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/chat/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const sendFriendRequest = async (userId: string) => {
    if (!session) {
      console.error('User is not authenticated');
      return;
    }

    try {
      const response = await fetch('/api/chat/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId: userId }),
      });

      if (response.ok) {
        setSearchResults((prev) => prev.filter((user) => user.id !== userId));
      } else {
        const errorData = await response.json();
        console.error('Error sending friend request:', errorData.error);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Find Friends</h2>
      <div className="relative">
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {isLoading ? (
            <p className="text-center text-gray-500">Searching...</p>
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.profilePicture} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name}</span>
                </div>
                <Button
                  onClick={() => sendFriendRequest(user.id)}
                  size="sm"
                  variant="outline"
                >
                  Add Friend
                </Button>
              </div>
            ))
          ) : searchQuery ? (
            <p className="text-center text-gray-500">No users found</p>
          ) : null}
        </div>
      </ScrollArea>

      {/* <FriendRequests /> */}
    </div>
  );
};

const FriendRequests = () => {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!session) return;

      try {
        const response = await fetch('/api/friends/pending');
        const data = await response.json();
        setPendingRequests(data);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchPendingRequests();
  }, [session]);

  const respondToRequest = async (userId: string, accept: boolean) => {
    try {
      const response = await fetch('/api/friends/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, accept }),
      });

      if (response.ok) {
        setPendingRequests((prev) => prev.filter((user) => user.id !== userId));
      } else {
        const errorData = await response.json();
        console.error('Error responding to request:', errorData.error);
      }
    } catch (error) {
      console.error('Error responding to request:', error);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mt-4">Pending Friend Requests</h3>
      <ScrollArea className="h-[200px]">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => respondToRequest(user.id, true)} size="sm" variant="outline">
                  Accept
                </Button>
                <Button onClick={() => respondToRequest(user.id, false)} size="sm" variant="outline">
                  Reject
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No pending requests</p>
        )}
      </ScrollArea>
    </div>
  );
};
