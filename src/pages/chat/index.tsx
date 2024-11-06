import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Send, Users, UserPlus, Search } from 'lucide-react';
import { FriendSearch } from '@/components/FriendSearch';

// Types
interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  sender: {
    name: string;
    profilePicture: string;
  };
}

interface Friend {
  id: string;
  name: string;
  profilePicture: string;
  isOnline: boolean;
  lastSeen: string;
  lastMessage?: string;
}

interface FriendRequest {
  id: string;
  user: {
    id: string;
    name: string;
    profilePicture: string;
  };
}

interface SearchUser {
  id: string;
  name: string;
  profilePicture: string;
}


const ChatApp = () => {
  const { data: session, status } = useSession();
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [showFriendSearch, setShowFriendSearch] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch('/api/chat/friends');
        const data = await response.json();
        setFriends(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setFriends([]);
      }
    };
    fetchFriends();
  }, []);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch('/api/chat/request');
        const data = await response.json();
        setFriendRequests(data);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };
    fetchFriendRequests();

    const interval = setInterval(fetchFriendRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedFriend) return;
      try {
        const response = await fetch(`/api/chat/message?friendId=${selectedFriend.id}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (selectedFriend) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedFriend]);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend) return;

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          receiverId: selectedFriend.id,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        const newMsg: Message = {
          id: Date.now().toString(),
          content: newMessage,
          senderId: session?.user?.id || '',
          receiverId: selectedFriend.id,
          createdAt: new Date().toISOString(),
          sender: {
            name: session?.user?.name || '',
            profilePicture: session?.user?.image || '',
          },
        };
        setMessages(prev => [...prev, newMsg]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/chat/friends/accept/${requestId}`, {
        method: 'POST',
      });

      if (response.ok) {
        setFriendRequests(prev =>
          prev.filter(request => request.id !== requestId)
        );
        const friendsResponse = await fetch('/api/chat/friends');
        const friendsData = await friendsResponse.json();
        setFriends(friendsData);
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please sign in to access the chat</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Friends List - Desktop */}
      <Card className="hidden md:flex flex-col w-80 h-full border-r">
        <div className="p-4 border-b">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => setShowFriendSearch(true)} variant="outline">
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>



          {friendRequests.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Friend Requests</h3>
              <div className="space-y-2">
                {friendRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={request.user.profilePicture} />
                        <AvatarFallback>{request.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{request.user.name}</span>
                    </div>
                    <Button
                      onClick={() => acceptFriendRequest(request.id)}
                      size="sm"
                    >
                      Accept
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 p-4">
          {filteredFriends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => setSelectedFriend(friend)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${selectedFriend?.id === friend.id
                  ? 'bg-blue-50'
                  : 'hover:bg-gray-100'
                }`}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={friend.profilePicture} />
                  <AvatarFallback>{friend.name[0]}</AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${friend.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">{friend.name}</p>
                <p className="text-sm text-gray-500">
                  {friend.isOnline
                    ? 'Online'
                    : `Last seen ${new Date(friend.lastSeen).toLocaleTimeString()}`}
                </p>
              </div>
            </button>
          ))}
        </ScrollArea>
      </Card>
      <Sheet open={showFriendSearch} onOpenChange={setShowFriendSearch}>
        <SheetContent>
          <FriendSearch />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col">
        {selectedFriend ? (
          <>
            <div className="p-4 border-b bg-white">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedFriend.profilePicture} />
                  <AvatarFallback>{selectedFriend.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{selectedFriend.name}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedFriend.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${message.senderId === session?.user?.id
                        ? 'flex-row-reverse'
                        : ''
                      }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={message.sender.profilePicture} />
                      <AvatarFallback>
                        {message.sender.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${message.senderId === session?.user?.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100'
                        }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a friend to start chatting</p>
          </div>
        )}
      </div>

      <div className="md:hidden absolute left-4 top-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Users className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="p-4 border-b">
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <ScrollArea className="flex-1">
              {filteredFriends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => {
                    setSelectedFriend(friend);
                    document.dispatchEvent(
                      new KeyboardEvent('keydown', { key: 'Escape' })
                    );
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-100"
                >
                  <Avatar>
                    <AvatarImage src={friend.profilePicture} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-sm text-gray-500">
                      {friend.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </SheetContent>
          <Button onClick={() => setShowFriendSearch(true)} variant="outline">
            <UserPlus className="w-4 h-4" />
          </Button>
        </Sheet>
      </div>
    </div>
  );
};

export default ChatApp;