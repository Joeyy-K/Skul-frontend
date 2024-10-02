import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiUserPlus } from 'react-icons/fi';
import ProfileModal from './ProfileModal';
import Cookies from 'js-cookie';
import Avatar from '../../../components/shared/Avatars';
import { toast } from 'react-toastify';

const StudentList = ({ students, grades = [], onStudentUpdate }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAssignGradeModal, setShowAssignGradeModal] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
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
        } else if (action === 'assign') {
            setSelectedStudentId(studentId);
            setShowAssignGradeModal(true);
        }
    };

    const handleAssignGrade = async (gradeId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/school/grades/${gradeId}/student/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userToken}`,
                },
                body: JSON.stringify({ student_id: selectedStudentId }),
            });

            if (response.ok) {
                toast.success('Student successfully assigned to grade');
                setShowAssignGradeModal(false);
                onStudentUpdate();
            } else {
                toast.error('Failed to assign student to grade');
            }
        } catch (error) {
            console.error('Error assigning student to grade:', error);
            toast.error('An error occurred while assigning student to grade');
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
                                    {!student.grade_name && (
                                        <button
                                            onClick={(e) => handleActionClick(e, 'assign', student.id)}
                                            className="text-green-600 hover:text-green-900 mr-3"
                                            title="Assign to Grade"
                                        >
                                            <FiUserPlus />
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => handleActionClick(e, 'unassign', student.id)}
                                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                                        title="Unassign from Grade"
                                    >
                                        <FiEdit2 />
                                    </button>
                                    {userRole === 'school' && (
                                        <button
                                            onClick={(e) => handleActionClick(e, 'delete', student.id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Delete Student"
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
            {showAssignGradeModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Assign Student to Grade</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">Select a grade to assign the student:</p>
                                    <div className="mt-4">
                                        {grades.map((grade) => (
                                            <button
                                                key={grade.id}
                                                onClick={() => handleAssignGrade(grade.id)}
                                                className="mb-2 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                                            >
                                                {grade.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setShowAssignGradeModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentList;