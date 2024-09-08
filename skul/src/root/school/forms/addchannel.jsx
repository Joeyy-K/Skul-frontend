import React, { useState, useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import Cookies from 'js-cookie';

function AddChannel() {
  const { user } = useContext(UserContext);
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [channelType, setChannelType] = useState('class');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  let userToken = Cookies.get('userToken');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

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
      if (response.ok) {
        setChannelName('');
        setChannelDescription('');
        setChannelType('class');
        setSuccess('Channel created successfully!');
        if (typeof onChannelAdded === 'function') {
          onChannelAdded();
        }
      }

      if (!response.ok) {
        throw new Error(data.detail || 'Could not create channel.');
      }

      setChannelName('');
      setChannelDescription('');
      setChannelType('class');
      setSuccess('Channel created successfully!');
    } catch (error) {
      console.error('Error creating channel:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Create New Channel</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="channelName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Channel Name
          </label>
          <input
            type="text"
            id="channelName"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        <div>
          <label htmlFor="channelDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="channelDescription"
            value={channelDescription}
            onChange={(e) => setChannelDescription(e.target.value)}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        <div>
          <label htmlFor="channelType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Channel Type
          </label>
          <select
            id="channelType"
            value={channelType}
            onChange={(e) => setChannelType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value="class">Class</option>
            <option value="school">School</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
        {success && <p className="text-green-600 dark:text-green-400">{success}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Creating...' : 'Create Channel'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddChannel;