import React, { useState, useEffect } from 'react';
import { FiX, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { API_URL } from '../../../components/url/url';

const AddStudentModal = ({ gradeId, schoolId, onAddStudent, userToken, onClose }) => {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(`${API_URL}/school/students/?school_id=${schoolId}`, {
                    headers: { 'Authorization': `Token ${userToken}` },
                });
                const data = await response.json();
                setStudents(data);
            } catch (error) {
                console.error('Error fetching students:', error);
                toast.error('Failed to fetch students. Please try again.');
            }
        };

        fetchStudents();
    }, [userToken, schoolId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddStudent(selectedStudents);
        onClose();
    };

    const handleStudentSelection = (studentId) => {
        setSelectedStudents(prevSelected =>
            prevSelected.includes(studentId)
                ? prevSelected.filter(id => id !== studentId)
                : [...prevSelected, studentId]
        );
    };

    const filteredStudents = students.filter(student =>
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add Students to Grade</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200">
                        <FiX size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <FiSearch className="absolute top-3 left-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <div className="mb-4 max-h-60 overflow-y-auto space-y-2">
                        {filteredStudents.map((student) => (
                            <div key={student.id} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200">
                                <input
                                    type="checkbox"
                                    id={`student-${student.id}`}
                                    value={student.id}
                                    checked={selectedStudents.includes(student.id)}
                                    onChange={() => handleStudentSelection(student.id)}
                                    className="mr-3 form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                                />
                                <label htmlFor={`student-${student.id}`} className="flex-grow text-gray-700 dark:text-gray-200">
                                    {student.first_name} {student.last_name}
                                </label>
                            </div>
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                        disabled={selectedStudents.length === 0}
                    >
                        Add Selected Students ({selectedStudents.length})
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;