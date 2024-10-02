import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const AssignTeacherModal = ({ gradeId, schoolId, onAssignTeacher, userToken, onClose }) => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/school/teachers/?school_id=${schoolId}`, {
                    headers: { 'Authorization': `Token ${userToken}` },
                });
                const data = await response.json();
                setTeachers(data);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };

        fetchTeachers();
    }, [schoolId, userToken]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAssignTeacher(gradeId, selectedTeacher);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold dark:text-gray-200">Assign Teacher to Grade</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <select
                        value={selectedTeacher}
                        onChange={(e) => setSelectedTeacher(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                        required
                    >
                        <option value="">Select a teacher</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.first_name} {teacher.last_name}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        Assign Teacher
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AssignTeacherModal;