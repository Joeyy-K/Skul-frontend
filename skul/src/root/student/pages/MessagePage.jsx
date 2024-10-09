import React, { useState, useEffect, useContext } from 'react';
import Modal from '../components/Modal';
import SendMessage from '../components/SendMessage';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import ChannelUsersModal from '../components/ChannelUsersModal';
import { UserContext } from '../../../contexts/UserContext';
import { useStudentData } from "../context/useStudentData";
import { API_URL } from '../../../components/url/url';

function MessagePage() {
    const { student, loading } = useStudentData();
    const { channelId } = useParams();
    const [messages, setMessages] = useState([]);
    const userToken = Cookies.get('userToken');
    const { user } = useContext(UserContext);
    const [channelUsers, setChannelUsers] = useState([]);
    const [showChannelUsers, setShowChannelUsers] = useState(false);
    const handleNewMessage = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const fetchMessages = async (channelId) => {
        try {
        const response = await fetch(`${API_URL}/school/channels/${channelId}/messages/`, {
            headers: {
            'Authorization': `Token ${userToken}`,
            },
        });
        const data = await response.json();
        setMessages(data);
        } catch (error) {
        console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        if (channelId) {
          fetchMessages(channelId);
          fetchChannelUsers(channelId);
        } else {
          console.log("Missing channelId");
        }
      }, [channelId]);
      
    const toggleChannelUsers = () => {
        setShowChannelUsers((prevShowChannelUsers) => !prevShowChannelUsers);
    };

    const fetchChannelUsers = async (channelId) => {
        try {
          const response = await fetch(`${API_URL}/school/channels/${channelId}/users/`, {
            headers: {
              'Authorization': `Token ${userToken}`,
            },
          });
          const data = await response.json();
          setChannelUsers(data);
        } catch (error) {
          console.error('Error fetching channel users:', error);
        }
      };

    if (loading) {
        return (
          <div>Loading...</div>
        );
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
              <ChannelUsersModal
                isOpen={showChannelUsers}
                onClose={toggleChannelUsers}
                channelUsers={channelUsers}
              />           
            )}
            <div>
            {messages.map((message) => {
            const sender = channelUsers.find((user) => user.id === message.sender);
            const username = sender ? sender.username : student?.school_name;
            
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