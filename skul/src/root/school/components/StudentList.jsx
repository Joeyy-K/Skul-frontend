import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProfileModal from './ProfileModal';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Avatar from '../../../components/shared/Avatars';

const StudentList = ({ students, grades = [], onStudentUpdate }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const itemsPerPage = 10;
    const userToken = Cookies.get('userToken');
    const userRole = Cookies.get('role');

    const indexOfLastStudent = currentPage * itemsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
    const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

    const totalPages = Math.ceil(students.length / itemsPerPage);

    const studentFields = [
        { label: 'Name', value: (student) => `${student.first_name} ${student.last_name}` },
        { label: 'School', value: (student) => student.school_name },
        { label: 'Grade', value: (student) => student.grade_name || 'Not Assigned' },
        { label: 'Email', value: (student) => student.user?.email || 'N/A' },
    ];

    const handleRowClick = (student) => {
        setSelectedStudent(student);
    };

    const handleCloseModal = () => {
        setSelectedStudent(null);
    };

    const onUnassignStudent = (studentId) => {
        fetch(`http://127.0.0.1:8000/school/unassign-student/${studentId}/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            toast.success(data.message);
            onStudentUpdate();
        })
        .catch(error => {
            console.error('Error:', error);
            toast.error('Failed to unassign student');
        });
    };

    const onDeleteStudent = (studentId) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            fetch(`http://127.0.0.1:8000/school/delete-student/${studentId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${userToken}`,
                },
            })
            .then(response => response.json())
            .then(data => {
            toast.success(data.message);
            onStudentUpdate();
            })
            .catch(error => {
            console.error('Error:', error);
            toast.error('Failed to delete student');
            });
        }
        };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleActionClick = (e, action, studentId) => {
        e.stopPropagation(); 
        if (action === 'unassign') {
            onUnassignStudent(studentId);
        } else if (action === 'delete') {
            onDeleteStudent(studentId);
        }
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Avatar</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">School</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grade</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentStudents.map((student) => (
                            <tr 
                                key={student.id} 
                                onClick={() => handleRowClick(student)}
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Avatar 
                                        avatarUrl={student.user?.avatar_url} 
                                        name={`${student.first_name} ${student.last_name}`} 
                                        size={32} 
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {student.first_name} {student.last_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {student.school_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {student.grade_name || 'Not Assigned'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={(e) => handleActionClick(e, 'unassign', student.id)}
                                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                                    >
                                        <FiEdit2 />
                                    </button>
                                    {userRole === 'school' && (
                                        <button
                                            onClick={(e) => handleActionClick(e, 'delete', student.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                    <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiChevronLeft />
                    </button>
                    <span className="text-gray-600 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiChevronRight />
                    </button>
                </div>
            )}
            {selectedStudent && (
                <ProfileModal
                    title="Student Profile"
                    data={selectedStudent}
                    fields={studentFields}
                    onClose={handleCloseModal}
                />
            )}
 
        </>
    );
};

export default StudentList;