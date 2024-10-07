import React, { useState, useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

function SendMessage({ channelId, onNewMessage }) {
    const { user } = useContext(UserContext);
    const [newMessage, setNewMessage] = useState('');
    const userToken = Cookies.get('userToken');

    const handleSendMessage = async () => {
        if (channelId && user) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/school/channels/${channelId}/messages/create/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newMessage, sender: user.id }),
            });
            const data = await response.json();
            if (!response.ok) {
            throw new Error(data.detail || 'Could not send message.');
            }
            onNewMessage(data);
            setNewMessage('');
        
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('failed to send message', error)
        }
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2">
            <div className="flex items-center">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full border rounded-full py-2 px-4 mr-2"
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage} disabled={!channelId || !user} className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full">
                    Send
                </button>
            </div>
        </div>
    );
}

export default SendMessage;