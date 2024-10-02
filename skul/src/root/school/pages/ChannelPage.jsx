import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import AddChannel from '../forms/AddChannel';
import { Link, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FiMessageSquare, FiTrash2 } from 'react-icons/fi';

function ChannelPage() {
    const { user } = useContext(UserContext);
    const [channels, setChannels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddChannel, setShowAddChannel] = useState(false);
    const userToken = Cookies.get('userToken');

    useEffect(() => {
        fetchChannels();
    }, [user, userToken]);

    const fetchChannels = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://127.0.0.1:8000/school/channels/`, {
                headers: {
                    'Authorization': `Token ${userToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setChannels(data);
            } else {
                console.error('Unexpected data format:', data);
                setChannels([]);
            }
        } catch (error) {
            console.error('Error fetching channels:', error);
            setError('Failed to fetch channels. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteChannel = async (channelId) => {
        if (window.confirm('Are you sure you want to delete this channel?')) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/school/channels/${channelId}/delete/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: user.user.id })
                });
    
                if (response.ok) {
                    setChannels(channels.filter(channel => channel.id !== channelId));
                } else {
                    const data = await response.json();
                    alert(data.error || 'Failed to delete channel');
                }
            } catch (error) {
                console.error('Error deleting channel:', error);
                alert('Failed to delete channel');
            }
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-red-100 dark:bg-red-900 rounded-lg shadow-md">
                <svg className="w-12 h-12 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium mt-4 text-red-700 dark:text-red-200">{error}</h3>
                <button onClick={fetchChannels} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-800 min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold dark:text-white">Channels</h1>
                    <button
                        onClick={() => setShowAddChannel(!showAddChannel)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {showAddChannel ? 'Cancel' : 'Add Channel'}
                    </button>
                </div>

                {showAddChannel && <AddChannel onChannelAdded={fetchChannels} />}

                {channels.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-white dark:bg-gray-700 rounded-lg shadow-md">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <h3 className="text-xl font-medium mt-4 text-gray-700 dark:text-gray-200">No Channels Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Create a new channel to get started
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {channels.map((channel) => (
                            <div key={channel.id} className="bg-white dark:bg-gray-700 shadow rounded-lg p-6 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{channel.name}</h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">{channel.description}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Link 
                                        to={`/school-dashboard/messages/${channel.id}`} 
                                        className="flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        <FiMessageSquare className="mr-1" />
                                        View Messages
                                    </Link>
                                    {channel.creator === user.user.id && (
                                        <button 
                                            onClick={() => deleteChannel(channel.id)} 
                                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Outlet />
        </div>
    );
}

export default ChannelPage;