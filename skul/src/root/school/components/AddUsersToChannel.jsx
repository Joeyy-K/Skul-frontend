import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { SchoolContext } from '../context/schoolcontext';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../../components/url/url';

const AddUsersToChannel = ({ isOpen, onClose }) => {
  const { channelId } = useParams();
  const { school } = useContext(SchoolContext);
  const currentUser = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const userToken = Cookies.get('userToken');

  useEffect(() => {
    if (school && school.id) {
      fetchUsers();
    }
  }, [school]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/school/school/${school.id}/users/`, {
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const handleAddUsersToChannel = async () => {
    try {
      const promises = selectedUsers.map((userId) =>
        fetch(`${API_URL}/school/channels/${channelId}/add_user/${userId}/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${userToken}`,
            'Content-Type': 'application/json',
          },
        })
      );
      await Promise.all(promises);
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error('Error adding users to channel:', error);
    }
  };

  const filteredUsers = users
    .filter((user) => user.id !== currentUser.id)
    .filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add Users to Channel</h2>
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 border rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="h-64 overflow-y-auto mb-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  id={`user-${user.id}`}
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleUserSelect(user.id)}
                  className="rounded text-blue-500 focus:ring-blue-500 dark:bg-gray-700"
                />
                <label
                  htmlFor={`user-${user.id}`}
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  {user.username}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUsersToChannel}
              disabled={selectedUsers.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Add Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUsersToChannel;