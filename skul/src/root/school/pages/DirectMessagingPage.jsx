import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';
import Cookies from 'js-cookie';

function DirectMessagingPage() {
    const { recipientId } = useParams();
    const location = useLocation();
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const userToken = Cookies.get('userToken');
    const recipient = location.state?.recipient;

    useEffect(() => {
        fetchMessages();
    }, [recipientId]);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/school/direct-messages/${recipientId}/`, {
                headers: {
                    'Authorization': `Token ${userToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/school/direct-messages/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender: user.user?.id,
                    recipient: recipientId,  
                    content: newMessage,
                }),
            });
            if (response.ok) {
                setNewMessage('');
                fetchMessages();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!recipient) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4 dark:text-white">
                Conversation with {recipient.first_name} {recipient.last_name}
            </h1>
            <div className="h-96 overflow-y-auto mb-4 p-4 border rounded dark:border-gray-700">
                {messages.map(msg => (
                    <div key={msg.id} className={`mb-2 ${msg.sender === user.user.id ? 'text-right' : 'text-left'}`}>
                        <span className="inline-block px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
                            {msg.content}
                        </span>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="flex">
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow p-2 border rounded-l dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Type a message..."
                />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600">Send</button>
            </form>
        </div>
    );
}

export default DirectMessagingPage;