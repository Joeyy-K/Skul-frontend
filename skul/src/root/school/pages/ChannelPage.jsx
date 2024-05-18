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
    const schoolId = user.id;
    let userToken = Cookies.get('userToken');

    useEffect(() => {
        const fetchChannels = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/school/channels/`, {
            headers: {
                'Authorization': `Token ${userToken}`,
            },
            });
            const data = await response.json();
            setChannels(data);
        } catch (error) {
            console.error('Error fetching channels:', error);
        }
        };
        fetchChannels();
    }, [schoolId]);

    return (
        <div className="bg-gray-100 dark:bg-gray-800 min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-4 dark:text-white">Channels</h1>
            {channels.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300">No channels yet.</p>
            ) : (
                channels.map((channel, index) => (
                    <div key={index} className="bg-white dark:bg-gray-900 shadow rounded-lg p-4 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{channel.name}</h2>
                        <p className="text-gray-700 dark:text-gray-300">{channel.description}</p>
                        <Link to={`/school-dashboard/messages/${channel.id}`} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 mt-2 inline-block">View Messages</Link>
                    </div>
                ))
            )}
            <AddChannel />
            <Outlet />
        </div>
    );
}

export default ChannelPage;