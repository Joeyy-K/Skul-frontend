import React, { useState, useEffect, useCallback } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import Cookies from 'js-cookie';
import { FiPlus, FiX, FiEdit2, FiTrash2, FiPaperclip } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', attachment: null });
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);
    const userToken = Cookies.get('userToken');

    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/school/announcements/', {
                headers: { 'Authorization': `Token ${userToken}` },
            });
            if (!response.ok) throw new Error('Failed to fetch announcements');
            const data = await response.json();
            setAnnouncements(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [userToken]);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'attachment') {
            setNewAnnouncement(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setNewAnnouncement(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            for (const key in newAnnouncement) {
                formData.append(key, newAnnouncement[key]);
            }
            
            const response = await fetch('http://127.0.0.1:8000/school/announcements/', {
                method: 'POST',
                headers: { 'Authorization': `Token ${userToken}` },
                body: formData,
            });
            if (!response.ok) throw new Error('Failed to create announcement');
            await fetchAnnouncements();
            setNewAnnouncement({ title: '', content: '', attachment: null });
            setIsCreating(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEdit = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/school/announcements/${id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAnnouncement),
            });
            if (!response.ok) throw new Error('Failed to update announcement');
            await fetchAnnouncements();
            setIsEditing(null);
            setNewAnnouncement({ title: '', content: '', attachment: null });
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/school/announcements/${id}/`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Token ${userToken}` },
                });
                if (!response.ok) throw new Error('Failed to delete announcement');
                await fetchAnnouncements();
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const filteredAnnouncements = announcements
        .filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                     a.content.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => sortOrder === 'desc' ? 
            new Date(b.publish_date) - new Date(a.publish_date) : 
            new Date(a.publish_date) - new Date(b.publish_date));

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">Announcements</h1>
            
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <input
                    type="text"
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
                {user && user.is_staff && (
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center"
                    >
                        {isCreating ? <FiX className="mr-2" /> : <FiPlus className="mr-2" />}
                        {isCreating ? 'Cancel' : 'Create New Announcement'}
                    </button>
                )}
            </div>
            
            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newAnnouncement.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="content" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Content</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={newAnnouncement.content}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="attachment" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Attachment</label>
                                <input
                                    type="file"
                                    id="attachment"
                                    name="attachment"
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                                />
                            </div>
                            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                                Submit Announcement
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="space-y-6">
                {filteredAnnouncements.map((announcement) => (
                    <motion.div
                        key={announcement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                    >
                        {isEditing === announcement.id ? (
                            <form onSubmit={(e) => { e.preventDefault(); handleEdit(announcement.id); }}>
                                <input
                                    type="text"
                                    value={newAnnouncement.title}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                    className="w-full px-3 py-2 mb-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                                />
                                <textarea
                                    value={newAnnouncement.content}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                    className="w-full px-3 py-2 mb-2 text-gray-700 dark:text-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                                    rows="4"
                                ></textarea>
                                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded mr-2">Save</button>
                                <button onClick={() => setIsEditing(null)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded">Cancel</button>
                            </form>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{announcement.title}</h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">{announcement.content}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                    <span>Published: {formatDate(announcement.publish_date)}</span>
                                    {announcement.attachment && (
                                        <a href={announcement.attachment} className="text-blue-500 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-400 flex items-center" target="_blank" rel="noopener noreferrer">
                                            <FiPaperclip className="mr-1" /> View Attachment
                                        </a>
                                    )}
                                </div>
                                {user && user.is_staff && (
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <button onClick={() => { setIsEditing(announcement.id); setNewAnnouncement(announcement); }} className="text-blue-500 hover:text-blue-600">
                                            <FiEdit2 />
                                        </button>
                                        <button onClick={() => handleDelete(announcement.id)} className="text-red-500 hover:text-red-600">
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AnnouncementPage;