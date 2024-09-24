import React, { useState, useEffect } from 'react';


const View = () => {
  const [responsesCount, setResponsesCount] = useState(0);
  const [adminsCount, setAdminsCount] = useState(0);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('/api/admins');
        const data = await response.json();
        setAdminsCount(data.length); 
      } catch (error) {
        console.error('Failed to fetch admins count:', error);
      }
    };

    const fetchResponses = async () => {
      try {
        const response = await fetch('/api/alumni/info');
        const data = await response.json();
        setResponsesCount(data.data.length); 
      } catch (error) {
        console.error('Failed to fetch responses count:', error);
      }
    };

    fetchAdmins();
    fetchResponses();
  }, []);

  return (
    <div className=" bg-gray-100 lg:py-6 ">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard Analytics</h1>
      </header>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Number of Response</h2>
          <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{responsesCount}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Number of Admin</h2>
          <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{adminsCount}</p>
        </div>

      </div>
    </div>
  );
};

export default View;
