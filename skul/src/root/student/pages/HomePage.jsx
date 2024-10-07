import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { useStudentData } from "../context/useStudentData";
import Cookies from "js-cookie";

function HomePage() {
    const { user } = useContext(UserContext);
    const { student, loading } = useStudentData();
    console.log(user)
    console.log(student)
    const [schedules, setSchedules] = useState([]);
    const [schoolData, setSchoolData] = useState(null);
    const userToken = Cookies.get('userToken');


    useEffect(() => {
        if (user) {
            fetchSchoolData(user.school);
            fetchSchedules();
        }
    }, [user, student]);

    const fetchSchoolData = async (schoolId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/school/schools/${schoolId}/`, {
                headers: { 'Authorization': `Token ${userToken}` },
            });
            const data = await response.json();
            setSchoolData(data);
        } catch (error) {
            console.error('Error fetching school data:', error);
        }
    };

    const fetchSchedules = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/school/schedules/', {
                headers: { 'Authorization': `Token ${userToken}` },
            });
            const data = await response.json();
            console.log('Fetched schedules:', data); 
            setSchedules(data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No user data</h2>
                    <p className="text-gray-600 dark:text-gray-300">Unable to fetch user information.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div>loading...</div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900">
            <div className="">
                    <ScheduleSection
                        schedules={schedules} 
                        formatDate={formatDate}
                    />
            </div>
        </div>
    );
}

    function ScheduleSection({ schedules, formatDate }) {
        if (!schedules || schedules.length === 0) {
            return (
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between border-b border-gray-500 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            📅 Schedules
                        </h2>
                        <a href="/teacher-dashboard/schedules" className="flex items-center space-x-3 px-2 text-gray-900 dark:text-gray-200 dark:hover:text-gray-700 focus:outline-none hover:bg-gray-100 rounded-md">
                            <span>all</span>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 -2 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                                    <g transform="translate(-1043.000000, -676.000000)" id="Group" stroke="currentColor" strokeWidth={2}>
                                        <g transform="translate(1041.000000, 672.000000)" id="Shape">
                                            <path d="M13,5 L21,12 L13,19 M21,12 L3.00497942,12">
                                            </path>
                                        </g>
                                    </g>
                                </g>
                            </svg>                
                        </a>
                    </div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">No schedules available at the moment.</p>
                </div>
            );
        }

        const latestSchedule = schedules[0];

        return (
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-center border-b border-gray-500 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                        📅 Latest Schedule
                    </h2>
                    <a href="/teacher-dashboard/schedules" className="flex items-center space-x-3 px-2 text-gray-900 dark:text-gray-200 dark:hover:text-gray-700 focus:outline-none hover:bg-gray-100 rounded-md">
                        <span>all</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 -2 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                                <g transform="translate(-1043.000000, -676.000000)" id="Group" stroke="currentColor" strokeWidth={2}>
                                    <g transform="translate(1041.000000, 672.000000)" id="Shape">
                                        <path d="M13,5 L21,12 L13,19 M21,12 L3.00497942,12">
                                        </path>
                                    </g>
                                </g>
                            </g>
                        </svg>                
                    </a>
                </div>
                <div className="mt-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{latestSchedule.title}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">{latestSchedule.description}</p>
                    {latestSchedule.file && (
                        <a 
                            href={latestSchedule.file} 
                            className="mt-2 text-blue-500 dark:text-blue-300 hover:underline"
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            View Schedule File
                        </a>
                    )}
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(latestSchedule.publish_date)}
                    </p>
                </div>
            </div>
        );
}
  

export default HomePage;