import React, { useState, useEffect, useContext } from 'react';
import SendMessage from '../components/SendMessage';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';
import { SchoolContext } from '../context/schoolcontext';

function MessagePage() {
    const { school } = useContext(SchoolContext)
    const { channelId } = useParams();
    const [messages, setMessages] = useState([]);
    const userToken = Cookies.get('userToken');
    const { user } = useContext(UserContext);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (channelId) {
        fetchMessages(channelId);
        fetchUsers(); 
        }
    }, [channelId]);

    const handleNewMessage = (newMessage) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    const fetchUsers = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/school/school/${school.id}/users/`, {
            headers: {
              'Authorization': `Token ${userToken}`,
            },
          });
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
    };
      

    const fetchMessages = async (channelId) => {
        try {
        const response = await fetch(`http://127.0.0.1:8000/school/channels/${channelId}/messages/`, {
            headers: {
            'Authorization': `Token ${userToken}`,
            },
        });
        const data = await response.json();
        setMessages(data);
        console.log(data)
        } catch (error) {
        console.error('Error fetching messages:', error);
        }
    };

    return channelId ? (
        <div className="h-screen flex flex-col">
            <div className="bg-gray-200 dark:bg-gray-800 flex-1 overflow-y-scroll px-4 py-2 pb-56">
                <h2 className="font-medium mb-2 dark:text-white">Channel Messages</h2>
                <div>
                {messages.map((message) => {
                const sender = users.find(user => user.id === message.sender);
                return (
                    <div key={message.id} className={`mb-2 ${message.sender === user.user.id ? 'text-right' : ''}`}>
                        <div className="text-sm mb-1 dark:text-white">{sender ? sender.username : 'Unknown'}</div>
                        <div className={`inline-block rounded-lg p-2 shadow max-w-sm ${message.sender === user.user.id ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-900'}`}>
                            {message.content}
                        </div>
                    </div>
                );
                })}
                </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 fixed inset-x-0 bottom-0">
                <SendMessage channelId={channelId} onNewMessage={handleNewMessage} />
            </div>
        </div>
    ) : null;
}

export default MessagePage;
