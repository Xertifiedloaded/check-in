import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

export default function ChatWindow({ selectedUser, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef();

  useEffect(() => {
    fetch('/api/socket'); 
    socketRef.current = io();

    socketRef.current.on('receive-message', (message) => {
      if (
        (message.senderId === selectedUser?.id && message.receiverId === currentUser.id) ||
        (message.senderId === currentUser.id && message.receiverId === selectedUser?.id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [currentUser, selectedUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/conversation/message?senderId=${currentUser.id}&receiverId=${selectedUser.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error('Failed to fetch messages:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedUser && currentUser) {
      fetchMessages();
    }
  }, [selectedUser, currentUser]);

  const sendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newMessage.trim() || !selectedUser) return;

      try {
        const message = {
          senderId: currentUser.id,
          receiverId: selectedUser.id,
          content: newMessage,
        };

        const response = await fetch('/api/conversation/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message),
        });

        if (response.ok) {
          const data = await response.json();
          socketRef.current.emit('send-message', data);
          setNewMessage('');
          setMessages((prev) => [...prev, data]);
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    },
    [currentUser, selectedUser, newMessage]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col dark:bg-gray-900">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold dark:text-white">{selectedUser?.name}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-900">
        {loading ? (
          <p className="dark:text-gray-400">Loading messages...</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.senderId === currentUser.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[70%] ${
                  message.senderId === currentUser.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 dark:text-white'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t dark:border-gray-700">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border p-2 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
