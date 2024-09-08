import React from 'react';
import { FiX } from 'react-icons/fi';
import Avatar from '../../../components/shared/Avatars';

const ProfileModal = ({ title, data, fields, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <FiX size={24} />
            </button>
          </div>
          <div className="flex justify-center mb-4">
            <Avatar 
              avatarUrl={data.user?.avatar_url} 
              name={`${data.first_name} ${data.last_name}`} 
              size={64} 
            />
          </div>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <p key={index} className="text-gray-700 dark:text-gray-300">
                <strong>{field.label}:</strong> {field.value(data)}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default ProfileModal;