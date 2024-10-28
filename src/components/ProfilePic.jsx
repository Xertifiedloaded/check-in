import { useState } from 'react';
import Image from 'next/image';

const ProfilePicture = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      <div className="relative rounded-full cursor-pointer" onClick={openModal}>
        <Image
          src={profile?.profilePicture ?? "/no-user-pic.png"}
          alt={profile?.name}
          width={128}
          height={128}
          className="rounded-full h-32 w-32 object-cover"
        />
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
          <div className="relative bg-white rounded-lg shadow-lg">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &times; 
            </button>
            <div className="p-4">
              <Image
                src={profile?.profilePicture ?? "/no-user-pic.png"}
                alt={profile?.name}
                width={512}
                height={512}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
