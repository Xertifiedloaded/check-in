// import { useEffect, useState } from 'react';
// import UserSearch from './UserSearch';
// import UserList from './UserList';
// import ChatWindow from './ChatWindow';
// import { useSession } from 'next-auth/react';

// export default function ChatPage() {
//   const [users, setUsers] = useState([]);
//   const [conversations, setConversations] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [isSearching, setIsSearching] = useState(false);
//   const { data: session } = useSession();
//   const userId = session?.user?.id;

//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const response = await fetch(`/api/user/profile/userinfo?userId=${userId}`);
//         const data = await response.json();
//         setCurrentUser(data.data);
//       } catch (error) {
//         console.error('Failed to fetch current user:', error);
//       }
//     };

//     const fetchConversations = async () => {
//       try {
//         const response = await fetch('/api/conversation/message');
//         const data = await response.json();
//         setConversations(data);
//       } catch (error) {
//         console.error('Failed to fetch conversations:', error);
//       }
//     };

//     fetchCurrentUser();
//     fetchConversations();
//   }, [userId]);

//   const startNewChat = async (user) => {
//     try {
//       const response = await fetch('/api/conversation/message', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ participantId: user.id })
//       });
//       const newConversation = await response.json();
//       setConversations((prev) => [...prev, newConversation]);
//       setSelectedUser(user);
//       setIsSearching(false);
//     } catch (error) {
//       console.error('Failed to start conversation:', error);
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row h-screen">
//       <div className="w-full md:w-1/3 lg:w-1/4 border-r p-4">
//         <button
//           onClick={() => setIsSearching(true)}
//           className="w-full py-2 text-left dark:bg-transparent dark:border dark:border-white dark:px-2 bg-gray-200 rounded-lg mb-4"
//         >
//           Start new chat...
//         </button>
//         {isSearching ? (
//           <UserSearch onSelectUser={startNewChat} onClose={() => setIsSearching(false)} />
//         ) : (
//           <UserList users={users} selectedUser={selectedUser} onSelectUser={setSelectedUser} />
//         )}
//       </div>
//       <div className="flex-1 flex flex-col">
//         {selectedUser ? (
//           <ChatWindow selectedUser={selectedUser} currentUser={session?.user} />
//         ) : (
//           <div className="flex items-center justify-center h-full text-gray-500">
//             Select a user to start chatting
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect, useRef } from 'react';

const ChatApp = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/user/current');
        const data = await response.json();
        setCurrentUser(data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/conversations');
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages when selected user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const response = await fetch(`/api/messages/${selectedUser.id}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          receiverId: selectedUser.id,
        }),
      });
      const data = await response.json();
      setMessages([...messages, data]);
      setNewMessage('');

      // Update conversation list
      const updatedConversations = conversations.map(conv =>
        conv.id === selectedUser.id
          ? { ...conv, lastMessage: data.content, lastMessageTime: new Date() }
          : conv
      );
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsSearchOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar - Conversations */}
      <div className="w-1/4 bg-white border-r border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            New Chat
          </button>
        </div>

        {/* Conversation List */}
        <div className="overflow-y-auto h-[calc(100vh-100px)]">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleSelectUser(conversation.participant)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedUser?.id === conversation.participant.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-white">
                  {conversation.participant.name[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{conversation.participant.name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage || 'No messages yet'}
                  </p>
                </div>
                {conversation.lastMessageTime && (
                  <span className="text-xs text-gray-400">
                    {new Date(conversation.lastMessageTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="bg-white p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedUser.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedUser.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === currentUser?.id
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === currentUser?.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="text-xs opacity-75">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message input */}
            <form onSubmit={handleSendMessage} className="bg-white p-4 border-t">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </div>

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">New Chat</h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
              onChange={async (e) => {
                if (e.target.value.length >= 2) {
                  try {
                    const response = await fetch(
                      `/api/chat/search?q=${encodeURIComponent(e.target.value)}`
                    );
                    const data = await response.json();
                    setConversations([...conversations, ...data]);
                  } catch (error) {
                    console.error('Error searching users:', error);
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;