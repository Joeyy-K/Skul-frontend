import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { UserContext } from '../../../contexts/UserContext';
import { toast } from 'react-toastify';
import { API_URL } from '../../../components/url/url';

function SchedulesPage() {
    const [schedules, setSchedules] = useState([]);
    const [newSchedule, setNewSchedule] = useState({ title: '', description: '', file: null });
    const [isCreating, setIsCreating] = useState(false);
    const [errors, setErrors] = useState({});
    const userToken = Cookies.get('userToken');
    const { user } = useContext(UserContext);
    console.log(user)

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await fetch(`${API_URL}/school/schedules/`, {
                headers: { 'Authorization': `Token ${userToken}` },
            });
            const data = await response.json();
            setSchedules(data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSchedule(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setNewSchedule(prev => ({ ...prev, file: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newSchedule.title);
        formData.append('description', newSchedule.description);
        if (newSchedule.file) {
            formData.append('file', newSchedule.file);
        }
        formData.append('creator', user.user.id);
        formData.append('school', user.id);

        try {
            const response = await fetch(`${API_URL}/school/schedules/`, {
                method: 'POST',
                headers: { 'Authorization': `Token ${userToken}` },
                body: formData,
            });
            if (response.ok) {
                fetchSchedules();
                setNewSchedule({ title: '', description: '', file: null });
                setIsCreating(false);
                setErrors({});
                toast.success('Schedule created successfully!');
            } else {
                const errorData = await response.json();
                setErrors(errorData);
                toast.error('Failed to create schedule. Please check the form and try again.');
            }
        } catch (error) {
            console.error('Error creating schedule:', error);
            toast.error(error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Schedules</h1>
                
                <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">All Schedules</h2>
                        <button 
                            onClick={() => setIsCreating(!isCreating)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                        >
                            {isCreating ? 'Cancel' : 'Create New'}
                        </button>
                    </div>

                    {isCreating && (
                        <form onSubmit={handleSubmit} className="p-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="title">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newSchedule.title}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-600 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newSchedule.description}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-600 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="file">
                                    File (optional)
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    onChange={handleFileChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-600 leading-tight focus:outline-none focus:shadow-outline"
                                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Allowed file types: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG
                                </p>
                            </div>
                            {Object.keys(errors).length > 0 && (
                                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <strong className="font-bold">Error:</strong>
                                    <ul className="mt-2">
                                        {Object.entries(errors).map(([key, value]) => (
                                            <li key={key}>{`${key}: ${value}`}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out">
                                Create Schedule
                            </button>
                        </form>
                    )}

                    <div className="p-6">
                        {schedules.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">No schedules available.</p>
                        ) : (
                            <ul className="space-y-6">
                                {schedules.map((schedule) => (
                                    <li key={schedule.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{schedule.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-2">{schedule.description}</p>
                                        {schedule.file && (
                                            <a
                                                href={schedule.file}
                                                className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View File
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SchedulesPage;