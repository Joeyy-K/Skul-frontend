import React, { useState, useEffect, useContext } from 'react';
import Modal from '../components/Modal';
import SendMessage from '../components/SendMessage';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';
import { useTeacherData } from '../contexts/useTeacherData';

function MessagePage() {
    const { teacher, loading } = useTeacherData();
    console.log(teacher)
    const { channelId } = useParams();
    const [messages, setMessages] = useState([]);
    const userToken = Cookies.get('userToken');
    const { user } = useContext(UserContext);
    const [channelUsers, setChannelUsers] = useState([]);
    const [showChannelUsers, setShowChannelUsers] = useState(false);
    console.log("Rendering MessagePage. Channel Users:", channelUsers);
    console.log("Current user:", user);
    console.log("Current channelId:", channelId);
    const handleNewMessage = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
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
        console.log(data);
        } catch (error) {
        console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        if (channelId) {
          console.log("Fetching data for channel:", channelId);
          fetchMessages(channelId);
          fetchChannelUsers(channelId);
        } else {
          console.log("Missing channelId");
        }
      }, [channelId]);

    const toggleAddUsers = () => {
        setShowAddUsers((prevShowAddUsers) => !prevShowAddUsers);
        if (showChannelUsers) {
          setShowChannelUsers(false);
        }
    };
      
    const toggleChannelUsers = () => {
        setShowChannelUsers((prevShowChannelUsers) => !prevShowChannelUsers);
        if (showAddUsers) {
          setShowAddUsers(false);
        }
    };

    const fetchChannelUsers = async (channelId) => {
        try {
          console.log("Fetching users for channel:", channelId);
          const response = await fetch(`http://127.0.0.1:8000/school/channels/${channelId}/users/`, {
            headers: {
              'Authorization': `Token ${userToken}`,
            },
          });
          const data = await response.json();
          console.log("Fetched channel users data:", data);
          setChannelUsers(data);
        } catch (error) {
          console.error('Error fetching channel users:', error);
        }
      };

    if (loading) {
        return <div>Loading...</div>; 
      }

    return channelId ? (
        <div className="min-h-full flex flex-col">
        <div className="flex-1 overflow-y-scroll px-4 py-2">
            <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium dark:text-white">Channel Messages</h2>
            <div className="flex">
                <button
                className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                onClick={toggleChannelUsers}
                >
                <svg fill="#ffffff" width="24px" height="24px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="435.2" cy="409.5" r="102.4" />
                    <path d="M588.8 409.5c0 17.6-3.1 34.5-8.6 50.3 2.9.2 5.7.9 8.6.9 56.6 0 102.4-45.8 102.4-102.4 0-56.6-45.8-102.4-102.4-102.4-26.1 0-49.7 10.1-67.8 26.2 40.9 27.7 67.8 74.4 67.8 127.4zM435.2 563.1c-128 0-179.2 25.6-179.2 102.4v102.6h358.4V665.5c0-77.3-51.2-102.4-179.2-102.4z" />
                    <path d="M588.8 511.9c-14.5 0-27.9.4-40.5 1.1-2.3 2.5-4.6 4.9-7 7.2 63.7 13.5 124.2 49.5 124.2 145.3v51.4H768V614.3c0-77.3-51.2-102.4-179.2-102.4z" />
                </svg>
                </button>
            </div>
            </div>
            {showChannelUsers && (
            <Modal show={showChannelUsers} onClose={toggleChannelUsers}>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Channel Users</h3>
                <ul className="space-y-2">
                {channelUsers.map((user) => (
                    <li key={user.id} className="py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {user.username}
                    </li>
                ))}
                </ul>
            </div>
            </Modal>          
            )}
            <div>
            {messages.map((message) => {
            console.log("Processing message:", message);
            const sender = channelUsers.find((user) => user.id === message.sender);
            console.log("Found sender:", sender);
            const username = sender ? sender.username : teacher.school_name;
            
            return (
                <div key={message.id} className={`mb-2 ${message.sender === (user?.user?.id ?? null) ? 'text-right' : ''}`}>
                    <div
                        className={`inline-block rounded-lg p-2 shadow max-w-sm ${
                        message.sender === (user?.user?.id ?? null) ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-900 dark:text-white'
                        }`}
                    >
                        {message.content}
                    </div>
                    <div className="text-xs mt-1 dark:text-white">{username}</div>
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