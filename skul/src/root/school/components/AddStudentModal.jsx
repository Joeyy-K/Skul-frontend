import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const AddStudentModal = ({ gradeId, schoolId, onAddStudent, userToken, onClose }) => {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/school/students/?school_id=${schoolId}`, {
                    headers: { 'Authorization': `Token ${userToken}` },
                });
                const data = await response.json();
                setStudents(data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, [userToken, schoolId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddStudent(selectedStudents);  // Pass the array of selected student IDs
        onClose();
    };

    const handleStudentSelection = (studentId) => {
        setSelectedStudents(prevSelected => 
            prevSelected.includes(studentId)
                ? prevSelected.filter(id => id !== studentId)
                : [...prevSelected, studentId]
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add Students to Grade</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 max-h-60 overflow-y-auto">
                        {students.map((student) => (
                            <div key={student.id} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id={`student-${student.id}`}
                                    value={student.id}
                                    checked={selectedStudents.includes(student.id)}
                                    onChange={() => handleStudentSelection(student.id)}
                                    className="mr-2"
                                />
                                <label htmlFor={`student-${student.id}`}>
                                    {student.first_name} {student.last_name}
                                </label>
                            </div>
                        ))}
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
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