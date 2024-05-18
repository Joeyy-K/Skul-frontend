import React, { useState, useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import Cookies from 'js-cookie';

function AddChannel() {
  const { user } = useContext(UserContext);
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [channelType, setChannelType] = useState('class');
  let userToken = Cookies.get('userToken');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch('http://127.0.0.1:8000/school/channels/', {
            method: 'POST',
            headers: {
              'Authorization': `Token ${userToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: channelName,
              description: channelDescription,
              school: user.id,
              type: channelType, 
            }),
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.detail || 'Could not create channel.');
          }
          setChannelName('');
          setChannelDescription('');
          setChannelType('class');
          alert('Channel created successfully!');
        } catch (error) {
          console.error('Error creating channel:', error);
        }
      };

      return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 shadow rounded-lg p-4">
            <h1 className="text-xl font-bold mb-4 dark:text-white">Add Channel</h1>
            <label className="block mb-2">
                <span className="text-gray-700 dark:text-gray-300">Name:</span>
                <input
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    required
                    className="bg-gray-200 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-300"
                />
            </label>
            <label className="block mb-2">
                <span className="text-gray-700 dark:text-gray-300">Description:</span>
                <textarea
                    value={channelDescription}
                    onChange={(e) => setChannelDescription(e.target.value)}
                    className="bg-gray-200 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-300"
                />
            </label>
            <label className="block mb-2">
                <span className="text-gray-700 dark:text-gray-300">Type:</span>
                <select value={channelType} onChange={(e) => setChannelType(e.target.value)} className="bg-gray-200 p-4 rounded-lg cursor-pointer mb-4 mt-1 block w-full border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-gray-300">
                    <option value="class">Class</option>
                    <option value="school">School</option>
                    <option value="teacher">Teacher</option>
                </select>
            </label>
            <button type="submit" className="mt-4 px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">Add Channel</button>
        </form>
    );
}

export default AddChannel;
