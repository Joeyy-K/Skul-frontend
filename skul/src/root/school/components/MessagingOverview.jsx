import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';
import Cookies from 'js-cookie';
import Avatar from '../../../components/shared/Avatars';

function MessagingOverview() {
    const { user } = useContext(UserContext);
    const [conversations, setConversations] = useState([]);
    const userToken = Cookies.get('userToken');

    useEffect(() => {
        fetchConversations();
    }, []);

    console.log(conversations)

    const fetchConversations = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/school/conversations/', {
                headers: {
                    'Authorization': `Token ${userToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setConversations(data);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    return (
        <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Recent Messages</h2>
            <ul>
                {conversations.map(conv => (
                    <li key={conv.id} className="mb-2">
                        <Link to={`/school-dashboard/messages/${conv.id}`} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <Avatar 
                                avatarUrl={conv.avatar_url} 
                                name={`${conv.username}`} 
                                size={40} 
                            />
                            <div className="ml-3">
                                <p className="font-semibold dark:text-white">{conv.username}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{conv.last_message}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MessagingOverview;