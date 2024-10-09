import React, { useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import { useTeacherData } from '../contexts/useTeacherData';
import { FiPlus, FiSearch, FiFilter, FiChevronLeft } from 'react-icons/fi';
import CreateStudentProfile from '../forms/CreateStudentProfile';
import StudentList from '../components/StudentList';
import { API_URL } from '../../../components/url/url';

function GradesPage() {
    const { teacher, loading } = useTeacherData();
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const userToken = Cookies.get('userToken');

    useEffect(() => {
        if (teacher) {
            fetchStudents();
            fetchGrades();
        }
    }, [teacher, selectedGrade]);

    const fetchStudents = async () => {
        try {
            let url = `${API_URL}/school/students/?school_id=${teacher.school}`;
            if (selectedGrade && selectedGrade.id !== 'all') {
                url += `&grade_id=${selectedGrade.id}`;
            }
            const response = await fetch(url, {
                headers: { 'Authorization': `Token ${userToken}` },
            });
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchGrades = async () => {
        try {
            const response = await fetch(`${API_URL}/school/grades/?school_id=${teacher.school}`, {
                headers: { 'Authorization': `Token ${userToken}` },
            });
            const data = await response.json();
            setGrades([{ id: 'all', name: 'All Students' }, ...data]);
        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    };

    const handleAddStudent = (newStudent) => {
        setStudents([...students, newStudent]);
        setShowCreateForm(false);
    };

    const handleStudentUpdate = () => {
        fetchStudents();
    };

    const filteredStudents = useMemo(() => {
        return students.filter(student => 
            student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.last_name.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => {
            if (sortBy === 'name') {
                const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            } else if (sortBy === 'grade') {
                return sortOrder === 'asc' 
                    ? a.grade_name.localeCompare(b.grade_name)
                    : b.grade_name.localeCompare(a.grade_name);
            }
            return 0;
        });
    }, [students, searchTerm, sortBy, sortOrder]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">Loading...</div>
        );
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Students Management</h1>
                
                {selectedGrade ? (
                    <div className="mb-6">
                        <button
                            onClick={() => setSelectedGrade(null)}
                            className="flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            <FiChevronLeft className="mr-2" /> Back to Grades
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                        {grades.map((grade) => (
                            <button
                                key={grade.id}
                                onClick={() => setSelectedGrade(grade)}
                                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-300 text-gray-800 dark:text-white"
                            >
                                {grade.name}
                            </button>
                        ))}
                    </div>
                )}

                {selectedGrade && (
                    <>
                        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                            <div className="flex items-center">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search students..."
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
                                <FiPlus className="mr-2" /> Add New Student
                            </button>
                        </div>

                        {showCreateForm && (
                            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <CreateStudentProfile onAddStudent={handleAddStudent} selectedGrade={selectedGrade} />
                            </div>
                        )}

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    {selectedGrade.id === 'all' ? 'All Students' : `Students in ${selectedGrade.name}`}
                                </h2>
                                <div className="flex items-center">
                                    <span className="mr-2 text-gray-600 dark:text-gray-300">Sort by:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="mr-2 px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    >
                                        <option value="name">Name</option>
                                        <option value="grade">Grade</option>
                                    </select>
                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        <FiFilter className={`transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                            </div>
                            <StudentList
                                grades={grades}
                                students={filteredStudents}
                                selectedGrade={selectedGrade}
                                onStudentUpdate={handleStudentUpdate}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default GradesPage;