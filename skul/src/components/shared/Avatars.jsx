import React from 'react';

const Avatar = ({ avatarUrl, name, size = 40 }) => {
  if (avatarUrl) {
    return (
      <img 
        src={avatarUrl} 
        alt={`${name}'s avatar`}
        className="rounded-full"
        style={{ width: size, height: size }}
      />
    );
  }

  const initial = name ? name[0].toUpperCase() : '?';
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
  ];
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  const backgroundColor = colors[colorIndex];

  return (
    <div 
      className={`rounded-full ${backgroundColor} flex items-center justify-center text-white font-bold`}
      style={{ width: size, height: size }}
    >
      {initial}
    </div>
  );
};

export default Avatar;