import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Cookies from 'js-cookie';
import ProfileModal from './ProfileModal';
import Avatar from '../../../components/shared/Avatars';

const TeacherList = ({ teachers, onUnassignTeacher, onDeleteTeacher }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const itemsPerPage = 10;
    const userRole = Cookies.get('role');

    const indexOfLastTeacher = currentPage * itemsPerPage;
    const indexOfFirstTeacher = indexOfLastTeacher - itemsPerPage;
    const currentTeachers = teachers.slice(indexOfFirstTeacher, indexOfLastTeacher);

    const totalPages = Math.ceil(teachers.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const teacherFields = [
        { label: 'Name', value: (teacher) => `${teacher.first_name} ${teacher.last_name}` },
        { label: 'Email', value: (teacher) => teacher.user?.email || 'N/A' },
        { label: 'School', value: (teacher) => teacher?.school_name || 'Not Assigned' },
        { label: 'Grade', value: (teacher) => teacher?.grade_name || 'Not Assigned' },
    ];

    const handleRowClick = (teacher) => {
        setSelectedTeacher(teacher);
    };

    const handleActionClick = (e, action, teacherId) => {
        e.stopPropagation();  
        if (action === 'unassign') {
            onUnassignTeacher(teacherId);
        } else if (action === 'delete') {
            onDeleteTeacher(teacherId);
        }
    };

    const handleCloseModal = () => {
        setSelectedTeacher(null);
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Avatar</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Full Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grade</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Channel</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentTeachers.map((teacher) => (
                            <tr 
                                key={teacher.id} 
                                onClick={() => handleRowClick(teacher)}
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                <Avatar 
                                    avatarUrl={teacher.user?.avatar_url} 
                                    name={`${teacher.first_name} ${teacher.last_name}`} 
                                    size={32} 
                                />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {teacher.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {teacher.first_name} {teacher.last_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {teacher.user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {teacher?.grade_name || 'No grade assigned'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {teacher.user.channel ? teacher.user.channel : 'No channel assigned'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={(e) => handleActionClick(e, 'unassign', teacher.id)}
                                        className="text-yellow-600 hover:text-yellow-900 mr-3"
                                    >
                                        <FiEdit2 />
                                    </button>
                                    {userRole === 'school' && (
                                        <button
                                            onClick={(e) => handleActionClick(e, 'delete', teacher.id)}
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
            {selectedTeacher && (
                <ProfileModal
                    title="Teacher Profile"
                    data={selectedTeacher}
                    fields={teacherFields}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default TeacherList;