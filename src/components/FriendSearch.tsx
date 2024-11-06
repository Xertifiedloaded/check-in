
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface User {
  id: string;
  name: string;
  profilePicture: string;
}

export const FriendSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/chat/search?q=${searchTerm}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

//   const sendFriendRequest = async (userId: string) => {
//     try {
//       await fetch('/api/chat/request', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ friendId: userId }),
//       });
//       // Show success message
//       alert('Friend request sent!');
//     } catch (error) {
//       console.error('Error sending friend request:', error);
//     }
//   };

  return (
    <div className="p-4">
      <div className="flex gap-2">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
        />
        <Button onClick={searchUsers} disabled={isLoading}>
          Search
        </Button>
      </div>
      
      <div className="mt-4 space-y-2">
        {searchResults.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <span>{user.name}</span>
            </div>
            <Button onClick={() => sendFriendRequest(user.id)} variant="outline">
              Add Friend
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};