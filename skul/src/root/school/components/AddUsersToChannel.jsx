import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { SchoolContext } from '../context/schoolcontext';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

const AddUsersToChannel = () => {
    const { channelId } = useParams();
    const { school } = useContext(SchoolContext);
    const currentUser = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const userToken = Cookies.get('userToken');

    useEffect(() => {
      if ( school && school.id) {
        fetchUsers();
      }
    }, [school]);

    const fetchUsers = async () => {
        try {
        const response = await fetch(`http://127.0.0.1:8000/school/school/${school.id}/users/`, {
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
            fetch(`http://127.0.0.1:8000/school/channels/${channelId}/add_user/${userId}/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json',
            },
            })
        );

        await Promise.all(promises);
        setSelectedUsers([]);
        } catch (error) {
        console.error('Error adding users to channel:', error);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add Users to Channel</h2>
          <ul className="space-y-4">
            {users
              .filter((user) => user.id !== currentUser.id)
              .map((user) => (
                <li key={user.id} className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserSelect(user.id)}
                  />
                  <span className="text-gray-900 dark:text-white">{user.username}</span>
                </li>
              ))}
          </ul>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={handleAddUsersToChannel}
            disabled={selectedUsers.length === 0}
          >
            Add Users
          </button>
        </div>
      );
};

export default AddUsersToChannel;