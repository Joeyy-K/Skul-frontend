import React, { useState } from 'react';

const ChannelUsersModal = ({ isOpen, onClose, channelUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = channelUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Channel Users</h2>
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 pl-10 border rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="h-[300px] overflow-y-auto pr-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white mb-2"
              >
                {user.username}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelUsersModal;