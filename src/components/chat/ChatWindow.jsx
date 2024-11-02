import { useState } from 'react';

export default function ChatWindow({ selectedUser, currentUser }) {
  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Send message to backend (this would be integrated with real-time functionality ideally)
    try {
      await fetch('/api/conversation/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, toUserId: selectedUser.id })
      });
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-xl font-semibold mb-4">{selectedUser.name}</h2>
        {/* This is where messages would be mapped */}
      </div>
      <div className="border-t p-4">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="w-full p-2 dark:bg-transparent border rounded-lg"
        />
      </div>
    </div>
  );
}
