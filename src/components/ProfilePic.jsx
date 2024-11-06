

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, X, ArrowUp, ArrowDown } from 'lucide-react';
import { LoadingSpinner } from '../pages/information/[userId]';

const ProfilePicture = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState('center');

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const getObjectPosition = () => {
    switch (position) {
      case 'top':
        return 'object-top';
      case 'bottom':
        return 'object-bottom';
      default:
        return 'object-bottom';
    }
  };

  return (
    <>
      <div className="group relative">
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-gray-200">
          <Image
            src={profile?.profilePicture ?? "/no-user-pic.png"}
            alt={profile?.name ?? "Profile picture"}
            width={128}
            height={128}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div 
            onClick={() => setIsOpen(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/20 cursor-pointer"
          >
            <Camera className="text-white opacity-0 transform scale-75 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100" />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-w-3xl w-full bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {profile?.name ?? "Profile Picture"}
                </h2>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setPosition('top')}
                    className={`p-2 rounded-md transition-colors ${
                      position === 'top' ? 'bg-gray-200' : 'hover:bg-gray-100'
                    }`}
                    title="Show top"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPosition('center')}
                    className={`p-2 rounded-md transition-colors ${
                      position === 'center' ? 'bg-gray-200' : 'hover:bg-gray-100'
                    }`}
                    title="Show center"
                  >
                    <div className="h-4 w-4 border-2 border-gray-500 rounded-sm" />
                  </button>
                  <button
                    onClick={() => setPosition('bottom')}
                    className={`p-2 rounded-md transition-colors ${
                      position === 'bottom' ? 'bg-gray-200' : 'hover:bg-gray-100'
                    }`}
                    title="Show bottom"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="relative p-4">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <LoadingSpinner/>
                </div>
              )}
              
              <Image
                src={profile?.profilePicture ?? "/no-user-pic.png"}
                alt={profile?.name ?? "Profile picture"}
                width={800}
                height={800}
                className={`w-full h-[500px] object-cover rounded-lg ${getObjectPosition()}`}
                onLoadingComplete={handleImageLoad}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePicture;









export const DashboardPic = ({ profile, handleImageUpload,handleDeleteImage, uploadLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState('center');

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const getObjectPosition = () => {
    switch (position) {
      case 'top':
        return 'object-top';
      case 'bottom':
        return 'object-bottom';
      default:
        return 'object-center';
    }
  };

  return (
    <>

      <div className="group relative">
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-gray-200">
          <Image
            src={profile?.profilePicture ?? "/no-user-pic.png"}
            alt={profile?.name ?? "Profile picture"}
            width={128}
            height={128}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onLoadingComplete={handleImageLoad}
          />
          <div 
            onClick={() => setIsOpen(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/20 cursor-pointer"
          >
            <Camera className="text-white opacity-0 transform scale-75 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100" />
          </div>
        </div>
      
        <label className="cursor-pointer p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 absolute bottom-4 right-4">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadLoading}
          />
          <Camera className="h-4 w-4 text-gray-600" />
        </label>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-w-3xl w-full bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {profile?.name ?? "Profile Picture"}
                </h2>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setPosition('top')}
                    className={`p-2 rounded-md transition-colors ${
                      position === 'top' ? 'bg-gray-200' : 'hover:bg-gray-100'
                    }`}
                    title="Show top"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPosition('center')}
                    className={`p-2 rounded-md transition-colors ${
                      position === 'center' ? 'bg-gray-200' : 'hover:bg-gray-100'
                    }`}
                    title="Show center"
                  >
                    <div className="h-4 w-4 border-2 border-gray-500 rounded-sm" />
                  </button>
                  <button
                    onClick={() => setPosition('bottom')}
                    className={`p-2 rounded-md transition-colors ${
                      position === 'bottom' ? 'bg-gray-200' : 'hover:bg-gray-100'
                    }`}
                    title="Show bottom"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="relative p-4">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                  <LoadingState />
                </div>
              )}
              
              <Image
                src={profile?.profilePicture ?? "/no-user-pic.png"}
                alt={profile?.name ?? "Profile picture"}
                width={800}
                height={800}
                className={`w-full h-[500px] object-cover rounded-lg ${getObjectPosition()}`}
                onLoadingComplete={handleImageLoad}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};


