import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { SchoolContext } from '../context/schoolcontext';
import AddChannel from '../forms/AddChannel';
import { Link, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

function ChannelPage() {
    const { channelId } = useParams();
    const { user } = useContext(UserContext);
    const { school } = useContext(SchoolContext);
    const [channels, setChannels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const schoolId = user?.id;
    let userToken = Cookies.get('userToken');

    useEffect(() => {
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
                setChannels([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchChannels();
    }, [schoolId, userToken]);

    const deleteChannel = async (channelId) => {
        if (window.confirm('Are you sure you want to delete this channel?')) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/school/channels/${channelId}/delete/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: user.user.id }) // Include the user ID in the request body
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
        return <div className="text-center">Loading channels...</div>;
    }

    if (error) {
        return (
            <div className="no-file-found flex flex-col items-center justify-center py-8 px-4 text-center bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
                <svg className="w-12 h-12 dark:text-gray-400 text-gray-700" stroke="currentColor" fill="currentColor" strokeWidth="0" height="200px" width="200px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="icon">
                    <path d="M917.7 148.8l-42.4-42.4c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-76.1 76.1a199.27 199.27 0 0 0-112.1-34.3c-51.2 0-102.4 19.5-141.5 58.6L432.3 308.7a8.03 8.03 0 0 0 0 11.3L704 591.7c1.6 1.6 3.6 2.3 5.7 2.3 2 0 4.1-.8 5.7-2.3l101.9-101.9c68.9-69 77-175.7 24.3-253.5l76.1-76.1c3.1-3.2 3.1-8.3 0-11.4zM769.1 441.7l-59.4 59.4-186.8-186.8 59.4-59.4c24.9-24.9 58.1-38.7 93.4-38.7 35.3 0 68.4 13.7 93.4 38.7 24.9 24.9 38.7 58.1 38.7 93.4 0 35.3-13.8 68.4-38.7 93.4zm-190.2 105a8.03 8.03 0 0 0-11.3 0L501 613.3 410.7 523l66.7-66.7c3.1-3.1 3.1-8.2 0-11.3L441 408.6a8.03 8.03 0 0 0-11.3 0L363 475.3l-43-43a7.85 7.85 0 0 0-5.7-2.3c-2 0-4.1.8-5.7 2.3L206.8 534.2c-68.9 69-77 175.7-24.3 253.5l-76.1 76.1a8.03 8.03 0 0 0 0 11.3l42.4 42.4c1.6 1.6 3.6 2.3 5.7 2.3s4.1-.8 5.7-2.3l76.1-76.1c33.7 22.9 72.9 34.3 112.1 34.3 51.2 0 102.4-19.5 141.5-58.6l101.9-101.9c3.1-3.1 3.1-8.2 0-11.3l-43-43 66.7-66.7c3.1-3.1 3.1-8.2 0-11.3l-36.6-36.2zM441.7 769.1a131.32 131.32 0 0 1-93.4 38.7c-35.3 0-68.4-13.7-93.4-38.7a131.32 131.32 0 0 1-38.7-93.4c0-35.3 13.7-68.4 38.7-93.4l59.4-59.4 186.8 186.8-59.4 59.4z"/>
                </svg>
                <h3 className="text-xl font-medium mt-4 text-gray-700 dark:text-gray-200">{error}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    working on it
                </p>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-800 min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-4 dark:text-white">Channels</h1>
            {channels.length === 0 ? (
                <div className="no-file-found flex flex-col items-center justify-center py-8 px-4 text-center bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
                <svg className="w-12 h-12 dark:text-gray-400 text-gray-700" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><g id="File_Off"><g><path d="M4,3.308a.5.5,0,0,0-.7.71l.76.76v14.67a2.5,2.5,0,0,0,2.5,2.5H17.44a2.476,2.476,0,0,0,2.28-1.51l.28.28c.45.45,1.16-.26.7-.71Zm14.92,16.33a1.492,1.492,0,0,1-1.48,1.31H6.56a1.5,1.5,0,0,1-1.5-1.5V5.778Z"></path><path d="M13.38,3.088v2.92a2.5,2.5,0,0,0,2.5,2.5h3.07l-.01,6.7a.5.5,0,0,0,1,0V8.538a2.057,2.057,0,0,0-.75-1.47c-1.3-1.26-2.59-2.53-3.89-3.8a3.924,3.924,0,0,0-1.41-1.13,6.523,6.523,0,0,0-1.71-.06H6.81a.5.5,0,0,0,0,1Zm4.83,4.42H15.88a1.5,1.5,0,0,1-1.5-1.5V3.768Z"></path></g></g></svg>
                <h3 className="text-xl font-medium mt-4 text-gray-700 dark:text-gray-200">No Channel Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  You can create one
                </p>
              </div>
            ) : (
                channels.map((channel) => (
                    <div key={channel.id} className="bg-white dark:bg-gray-900 shadow rounded-lg p-4 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{channel.name}</h2>
                        <p className="text-gray-700 dark:text-gray-300">{channel.description}</p>
                        <Link to={`/school-dashboard/messages/${channel.id}`} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 mt-2 inline-block">View Messages</Link>
                        {channel.creator === user.user.id && (
                            <button 
                                onClick={() => deleteChannel(channel.id)} 
                                className="ml-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500"
                            >
                                Delete Channel
                            </button>
                        )}
                    </div>
                ))
            )}
            <AddChannel />
            <Outlet />
        </div>
    );
}

export default ChannelPage;