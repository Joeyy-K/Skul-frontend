import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { SchoolContext } from '../context/schoolcontext';
import AddChannel from '../forms/AddChannel';
import Cookies from 'js-cookie';

function ChannelPage() {
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
        <div>
            <h1>Channels</h1>
            {channels.length === 0 ? (
                <p>No channels yet.</p>
            ) : (
                channels.map((channel, index) => (
                    <div key={index}>
                        <h2>{channel.name}</h2>
                        <p>{channel.description}</p>
                    </div>
                ))
            )}
            <AddChannel />
        </div>
    );
}

export default ChannelPage;
