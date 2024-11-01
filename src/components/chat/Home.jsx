import { useEffect, useState } from 'react';
import UserSearch from './UserSearch';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import { useSession } from 'next-auth/react';

export default function ChatPage() {
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(
            `/api/user/profile/userinfo?userId=${userId}`
          );
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
  }, []);

  const startNewChat = async (user) => {
    try {
      const response = await fetch('/api/conversation/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: user.id
        })
      });
      
      const newConversation = await response.json();
      setConversations(prev => [...prev, newConversation]);
      setSelectedUser(user);
      setIsSearching(false);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-1/3 flex flex-col bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
          <button
            onClick={() => setIsSearching(true)}
            className="w-full px-4 py-2 text-left text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Start new chat...
          </button>
        </div>
        {isSearching ? (
          <UserSearch
            currentUser={currentUser}
            onSelectUser={startNewChat}
            onClose={() => setIsSearching(false)}
          />
        ) : (
          <UserList
            conversations={conversations}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
          />
        )}
      </div>
      {selectedUser && currentUser && (
        <ChatWindow
          selectedUser={selectedUser}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

