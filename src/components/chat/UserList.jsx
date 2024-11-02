export default function UserList({ users, selectedUser, onSelectUser }) {
  return (
    <div className="overflow-y-auto h-full">
      <h3 className="text-lg font-semibold mb-4">Chats</h3>
      {users?.map((user) => (
        <div
          key={user.id}
          onClick={() => onSelectUser(user)}
          className={`p-3 rounded-lg cursor-pointer ${
            selectedUser?.id === user.id ? 'bg-blue-200' : 'hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center space-x-3">
            {user.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 bg-gray-400 text-white flex items-center justify-center rounded-full">
                {user.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
