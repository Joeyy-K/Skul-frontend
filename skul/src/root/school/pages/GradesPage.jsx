import React, { useState, useEffect, useMemo } from 'react';
import { useSchoolData } from '../context/useSchoolData';
import Cookies from 'js-cookie';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import AddGradeForm from '../forms/AddGradeForm';
import GradeList from '../components/GradeList';
import { toast } from 'react-toastify';

function GradesPage() {
    const { school, loading } = useSchoolData();
    const [grades, setGrades] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const userToken = Cookies.get('userToken');

    useEffect(() => {
        if (school) {
            fetchGrades();
            fetchTeachers();
        }
    }, [school]);

    const fetchGrades = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/school/grades/?school_id=${school.id}`, {
                headers: { 'Authorization': `Token ${userToken}` },
            });
            const data = await response.json();
            setGrades(data);
        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/school/teachers/?school_id=${school.id}`, {
                headers: { 'Authorization': `Token ${userToken}` },
            });
            const data = await response.json();
            setTeachers(data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const handleDeleteGrade = (gradeId) => {
        if (window.confirm('Are you sure you want to delete this grade? This action cannot be undone.')) {
            fetch(`http://127.0.0.1:8000/school/grades/${gradeId}/delete/`, {
                method: 'DELETE',
                headers: {
                'Authorization': `Token ${userToken}`,
                },
          })
            .then(response => {
                if (response.ok) {
                    setGrades(grades.filter(grade => grade.id !== gradeId));
                    toast.success('Grade deleted successfully');
                } else {
                    throw new Error('Failed to delete grade');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                toast.error('Failed to delete grade');
            });
        }
    };

    const handleAddGrade = (newGrade) => {
        setGrades([...grades, newGrade]);
        setShowCreateForm(false);
    };

    const filteredGrades = useMemo(() => {
        return grades.filter(grade => 
            grade.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            }
            return 0;
        });
    }, [grades, searchTerm, sortBy, sortOrder]);

    const handleAssignTeacher = async (gradeId, teacherId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/school/grades/${gradeId}/teacher/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userToken}`,
                },
                body: JSON.stringify({ teacher_id: teacherId }),
            });

            if (response.ok) {
                setGrades(prevGrades =>
                    prevGrades.map(grade =>
                        grade.id === gradeId
                            ? { ...grade, teacher: teachers.find(t => t.id === teacherId) }
                            : grade
                    )
                );
                toast.success('Teacher added successfully')
            } else {
                console.error('Failed to assign teacher');
                toast.error('failed to assign teacher')
            }
        } catch (error) {
            console.error('Error assigning teacher:', error);
            toast.error('Error assigning teacher:', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Grades Management</h1>

                <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                    <div className="flex items-center">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search grades..."
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
                        <FiPlus className="mr-2" /> Add New Grade
                    </button>
                </div>

                {showCreateForm && (
                    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <AddGradeForm onAddGrade={handleAddGrade} />
                    </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Grades
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
                    <GradeList
                        grades={filteredGrades}
                        onDeleteGrade={handleDeleteGrade}
                        onAssignTeacher={handleAssignTeacher}
                        userToken={userToken}
                        setGrades={setGrades}
                    />
                </div>
            </div>
        </div>
    );
}

export default GradesPage;