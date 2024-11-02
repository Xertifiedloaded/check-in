import { useEffect, useState } from 'react';
import UserSearch from './UserSearch';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import { useSession } from 'next-auth/react';

export default function ChatPage() {
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`/api/user/profile/userinfo?userId=${userId}`);
        const data = await response.json();
        setCurrentUser(data.data);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };

    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/conversation/message');
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    };

    fetchCurrentUser();
    fetchConversations();
  }, [userId]);

  const startNewChat = async (user) => {
    try {
      const response = await fetch('/api/conversation/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: user.id })
      });
      const newConversation = await response.json();
      setConversations((prev) => [...prev, newConversation]);
      setSelectedUser(user);
      setIsSearching(false);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/3 lg:w-1/4 border-r p-4">
        <button
          onClick={() => setIsSearching(true)}
          className="w-full py-2 text-left dark:bg-transparent dark:border dark:border-white dark:px-2 bg-gray-200 rounded-lg mb-4"
        >
          Start new chat...
        </button>
        {isSearching ? (
          <UserSearch onSelectUser={startNewChat} onClose={() => setIsSearching(false)} />
        ) : (
          <UserList users={users} selectedUser={selectedUser} onSelectUser={setSelectedUser} />
        )}
      </div>
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <ChatWindow selectedUser={selectedUser} currentUser={session?.user} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
