import React, { useState, useEffect, useMemo } from 'react';
import { useSchoolData } from '../context/useSchoolData';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import CreateTeacherForm from '../forms/CreateTeacherForm';
import TeacherList from '../components/TeacherList';
import { API_URL } from '../../../components/url/url';

function TeacherPage() {
    const { school, loading } = useSchoolData();
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const userToken = Cookies.get('userToken');

    useEffect(() => {
        if (school) {
            fetchTeachers();
        }
    }, [school]);

    const fetchTeachers = async () => {
        try {
            const response = await fetch(`${API_URL}/school/teachers/?school_id=${school.id}`, {
                headers: { 'Authorization': `Token ${userToken}` },
            });
            const data = await response.json();
            setTeachers(data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const handleAddTeacher = (newTeacher) => {
        setTeachers([...teachers, newTeacher]);
        setShowCreateForm(false);
    };

    const handleUnassignTeacher = (teacherId) => {
        fetch(`${API_URL}/school/unassign-teacher/${teacherId}/`, {
            method: 'POST',
            headers: {
            'Authorization': `Token ${userToken}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                toast.success(data.message);
                fetchTeachers();
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error('Failed to unassign teacher');
            });
        };

    const handleDeleteTeacher = (teacherId) => {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            fetch(`${API_URL}/school/delete-teacher/${teacherId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${userToken}`,
            },
            })
            .then(response => response.json())
            .then(data => {
                toast.success(data.message);
                fetchTeachers(); 
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error('Failed to delete teacher');
            });
        }
        };

    const filteredTeachers = useMemo(() => {
        return teachers.filter(teacher => 
            `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => {
            if (sortBy === 'name') {
                const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            }
            return 0;
        });
    }, [teachers, searchTerm, sortBy, sortOrder]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Teachers Management</h1>

                <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                    <div className="flex items-center">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search teachers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                            />
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
                    >
                        <FiPlus className="mr-2" /> Add New Teacher
                    </button>
                </div>

                {showCreateForm && (
                    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <CreateTeacherForm onAddTeacher={handleAddTeacher} />
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Teachers
                        </h2>
                        <div className="flex items-center">
                            <span className="mr-2 text-gray-600 dark:text-gray-300">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="mr-2 px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            >
                                <option value="name">Name</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                <FiFilter className={`transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>
                    <TeacherList
                        teachers={filteredTeachers}
                        onUnassignTeacher={handleUnassignTeacher}
                        onDeleteTeacher={handleDeleteTeacher}
                    />
                </div>
            </div>
        </div>
    );
}

export default TeacherPage;