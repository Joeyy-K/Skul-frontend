import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import Avatar from '../../../components/shared/Avatars';
import { API_URL } from '../../../components/url/url';
import { toast } from 'react-toastify';

function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const userToken = Cookies.get('userToken');
    try {
      const response = await fetch(`${API_URL}/school/profile/`, {
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
      school_info: {
        ...prevData.school_info,
        [name]: value,
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userToken = Cookies.get('userToken');
    try {
      const formData = new FormData();
      for (const key in profileData) {
        if (key !== 'avatar' && key !== 'teacher_info' && key !== 'school_info' && key !== 'student_info') {
          formData.append(key, profileData[key]);
        }
      }
      for (const key in profileData.school_info) {
        formData.append(`school_info.${key}`, profileData.school_info[key]);
      }

      const response = await fetch(`${API_URL}/school/profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Token ${userToken}`,
        },
        body: formData,
      });
      const updatedData = await response.json();
      if (response.ok) {
        toast.success('Updated Profile')
        setProfileData(updatedData);
        setIsEditing(false);
        setError(null);
      } else {
        setError(updatedData);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile:', error);
      setError('Failed to update profile');
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
          avatarUrl={profileData.avatar} 
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
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-400">School Username</label>
              <input
                type="text"
                name="username"
                value={profileData.username}
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
              <h3 className="text-sm font-medium text-gray-300 dark:text-gray-400">Username</h3>
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