
"use client";

import { useEffect, useRef, useState } from "react";


export  function ChatSidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
  onNewChat,
  onClose,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full bg-white dark:bg-gray-800 text-gray-900 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          <div className="flex space-x-2">
            <button
              onClick={onNewChat}
              className="bg-blue-500 text-white  px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              New Chat
            </button>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`p-4 cursor-pointer  transition-colors ${
              selectedConversation?.id === conversation.id ? "bg-blue-50 dark:bg-gray-500" : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                {conversation.participant.profilePicture ? (
                  <img
                    src={conversation.participant.profilePicture}
                    alt={conversation.participant.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100  dark:text-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-lg">
                      {conversation.participant.name[0].toUpperCase()}
                    </span>
                  </div>
                )}
                {conversation.participant.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900  dark:text-white truncate">
                    {conversation.participant.name}
                  </h3>
                  {conversation.lastMessageTime && (
                    <span className="text-xs text-gray-500">
                      {new Date(conversation?.lastMessageTime).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                  )}
                </div>
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage}
                  </p>
                )}
                {conversation.unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export  function ChatMain({ conversation, currentUser, onBack, onMessageSent }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (conversation) {
      fetchMessages();
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!conversation) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/chat/conversation/${conversation.participant.id}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          receiverId: conversation.participant.id,
        }),
      });
      const data = await response.json();
      setMessages([...messages, data]);
      setNewMessage("");
      onMessageSent(data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white  border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex items-center space-x-3">
            {conversation.participant.profilePicture ? (
              <img
                src={conversation.participant.profilePicture}
                alt={conversation.participant.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {conversation.participant.name[0].toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h2 className="font-semibold text-gray-800">
                {conversation.participant.name}
              </h2>
              <p className="text-sm text-gray-500">
                {conversation.participant.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentUser?.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.senderId === currentUser?.id
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>


      <form onSubmit={handleSendMessage} className="bg-white dark:bg-transparent  border-t p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}






export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchConversations();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/chat/current");
      if (!response.ok) throw new Error("Failed to fetch current user");
      const data = await response.json();
      setCurrentUser(data);
    } catch (error) {
      console.error("Error fetching current user:", error);
      setError("Failed to load user data.");
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/chat/conversation");
      if (!response.ok) throw new Error("Failed to fetch conversations");
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setError("Failed to load conversations.");
    } finally {
      setIsLoading(false);
    }
  };

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Failed to search users");
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const createNewConversation = async (userId) => {
    try {
      const response = await fetch("/api/chat/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) throw new Error("Failed to create conversation");
      const newConversation = await response.json();
      
      setConversations((prev) => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  // Search Modal Component
  const SearchModal = () => {
    if (!isSearchOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">New Chat</h2>
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Search for users..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchUsers(e.target.value);
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          
          <div className="max-h-96 overflow-y-auto">
            {searchResults.map((user) => (
              <div
                key={user.id}
                onClick={() => createNewConversation(user.id)}
                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {user.name[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  {user.email && (
                    <p className="text-sm text-gray-500">{user.email}</p>
                  )}
                </div>
              </div>
            ))}
            {searchQuery && searchResults.length === 0 && (
              <p className="text-center text-gray-500 py-4">No users found</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg"
        aria-label="Open sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <aside
        className={`${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative w-full lg:w-96 h-full transition-transform duration-200 ease-in-out z-40`}
      >
        <ChatSidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={(conversation) => {
            setSelectedConversation(conversation);
            setIsMobileSidebarOpen(false);
          }}
          onNewChat={() => setIsSearchOpen(true)}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      </aside>

      <main className="flex-1  lg:ml-96">
        {selectedConversation ? (
          <ChatMain
            conversation={selectedConversation}
            currentUser={currentUser}
            onBack={() => setSelectedConversation(null)}
            onMessageSent={(message) => {
              setSelectedConversation((prev) => ({
                ...prev,
                messages: [...prev.messages, message],
              }));
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </main>

      <SearchModal />
    </div>
  );
}