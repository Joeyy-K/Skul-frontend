import React, { useState, useEffect, useContext } from 'react';
import Cookies from "js-cookie";
import { UserContext } from "../../../contexts/UserContext";
import Avatar from '../../../components/shared/Avatars';

function ProfilePage() {
  const { user } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  console.log(profileData)

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const userToken = Cookies.get('userToken');
    try {
      const response = await fetch('http://127.0.0.1:8000/school/profile/', {
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      });
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userToken = Cookies.get('userToken');
    try {
      const response = await fetch('http://127.0.0.1:8000/school/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      const updatedData = await response.json();
      setProfileData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center h-screen mt-8">
      <div className="p-6 rounded-lg shadow-xl w-80">
        <div className="flex items-center space-x-4 mb-6">
        <Avatar 
          avatarUrl={user.user?.avatar_url} 
          name={`profileData.school_info.full_name`} 
          size={32} 
          className="w-16 h-16 rounded-full"
        />
          <div>
            <h2 className="text-xl font-semibold text-white dark:text-gray-100">{profileData.school_info.full_name}</h2>
            <p className="text-gray-300 dark:text-gray-400">{profileData.email}</p>
          </div>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-400">School Name</label>
              <input
                type="text"
                name="full_name"
                value={profileData.school_info.full_name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-400">School Username</label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-400">Location</label>
              <input
                type="text"
                name="location"
                value={profileData.school_info.location}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="flex justify-between">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Save</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-300 dark:text-gray-400">School Name</h3>
              <p className="text-white">{profileData.school_info.full_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300 dark:text-gray-400">School Username</h3>
              <p className="text-white">{profileData.username}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300 dark:text-gray-400">Location</h3>
              <p className="text-white">{profileData.school_info.location}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300 dark:text-gray-400">Email</h3>
              <p className="text-white">{profileData.email}</p>
            </div>
            <button onClick={() => setIsEditing(true)} className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-800 w-full">Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;