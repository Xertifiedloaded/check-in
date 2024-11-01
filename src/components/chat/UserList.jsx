import Image from 'next/image';

export default function UserList({ users, selectedUser, onSelectUser }) {
  return (
    <div className="w-1/3 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold dark:text-white">Chats</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-4rem)]">
        {users?.map((user) => (
          <div
            key={user.id}
            className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
              selectedUser?.id === user?.id ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
            onClick={() => onSelectUser(user)}
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
              {user?.profilePicture ? (
                <Image
                  src={user?.profilePicture}
                  alt={user?.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-xl text-gray-600 dark:text-gray-300">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium dark:text-white">{user?.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.username}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
