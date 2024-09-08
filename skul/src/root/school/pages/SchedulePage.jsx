import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "../../../contexts/UserContext";
import Cookies from "js-cookie";

const SchedulePage = () => {
    const { user } = useContext(UserContext);
    const [schedules, setSchedules] = useState([]);
    const userToken = Cookies.get('userToken');

    useEffect(() => {
        if (user) {
            fetchSchedules();
        }
    }, [user]);

    const fetchSchedules = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/school/schedules/', {
                headers: { 'Authorization': `Token ${userToken}` },
            });
            const data = await response.json();
            setSchedules(data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">All Schedules</h1>
            {schedules.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">No schedules available.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {schedules.map((schedule) => (
                        <div key={schedule.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{schedule.title}</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{schedule.description}</p>
                            {schedule.file && (
                                <a 
                                    href={schedule.file} 
                                    className="text-blue-500 dark:text-blue-300 hover:underline"
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    View Schedule File
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SchedulePage;