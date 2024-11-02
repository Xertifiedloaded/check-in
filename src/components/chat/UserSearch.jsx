import { useState } from 'react';

export default function UserSearch({ currentUser, onSelectUser, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/conversation/search?q=${encodeURIComponent(value)}`);
      const data = await response.json();
      setSearchResults(data.filter((user) => user.id !== currentUser?.id));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button onClick={onClose} className="absolute top-2 right-2">X</button>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full  dark:bg-transparent p-2 rounded-lg border"
      />
      <div className="mt-4">
        {loading ? (
          <p>Searching...</p>
        ) : (
          searchResults.map((user) => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {user.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
