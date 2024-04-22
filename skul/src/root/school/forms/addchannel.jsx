import React, { useState } from 'react';

const ChannelForm = () => {
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const channelData = {
      name: name,
    };

    fetch('http://127.0.0.1:8000/school/channels/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(channelData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Channel Name:
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
      </label>
      <input type="submit" value="Create Channel" />
    </form>
  );
};

export default ChannelForm;
