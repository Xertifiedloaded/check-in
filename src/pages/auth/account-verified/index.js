import React from 'react';
import { useRouter } from 'next/router';

const OtpSuccessPage = () => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/profile/edit'); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Account Verified Successfully!</h2>
        <p className="text-gray-700 mb-6">
          Your account has been verified. You can now log in to access your account.
        </p>
        <button
          onClick={handleLoginRedirect}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default OtpSuccessPage;