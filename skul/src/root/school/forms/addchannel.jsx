import React, { useState, useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import Cookies from 'js-cookie';

function AddChannel() {
    const { user } = useContext(UserContext);
    const [channelName, setChannelName] = useState('');
    const [channelDescription, setChannelDescription] = useState('');
    let userToken = Cookies.get('userToken');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://127.0.0.1:8000/channels/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: channelName,
                    description: channelDescription,
                    school: user.id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Could not create channel.');
            }

            setChannelName('');
            setChannelDescription('');
            alert('Channel created successfully!');
        } catch (error) {
            console.error('Error creating channel:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Add Channel</h1>

            <label>
                Name:
                <input type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)} required />
            </label>

            <label>
                Description:
                <textarea value={channelDescription} onChange={(e) => setChannelDescription(e.target.value)} />
            </label>

            <button type="submit">Add Channel</button>
        </form>
    );
}

export default AddChannel;
