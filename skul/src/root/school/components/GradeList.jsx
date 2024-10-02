import React, { useState, useMemo } from 'react';
import AssignTeacherModal from './AssignTeacherModal';
import ProfileModal from './ProfileModal';
import AddStudentModal from './AddStudentModal';
import { FiChevronLeft, FiChevronRight, FiTrash2, FiUserPlus, FiUserCheck } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const GradeList = ({
    grades,
    onDeleteGrade,
    onAssignTeacher,
    userToken,
    setGrades,
}) => {
    const userRole = Cookies.get('role');
    const [showAssignTeacherModal, setShowAssignTeacherModal] = useState(false);
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [selectedGradeId, setSelectedGradeId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const itemsPerPage = 10;

    const currentGrades = useMemo(() => {
        const indexOfLastGrade = currentPage * itemsPerPage;
        const indexOfFirstGrade = indexOfLastGrade - itemsPerPage;
        return grades.slice(indexOfFirstGrade, indexOfLastGrade);
    }, [grades, currentPage]);

    const totalPages = Math.ceil(grades.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleShowAssignTeacherModal = (e, gradeId) => {
        e.stopPropagation();
        setSelectedGradeId(gradeId);
        setShowAssignTeacherModal(true);
    };

    const handleShowAddStudentModal = (e, gradeId) => {
        e.stopPropagation();
        setSelectedGradeId(gradeId);
        setShowAddStudentModal(true);
    };

    const handleCloseAssignTeacherModal = () => {
        setShowAssignTeacherModal(false);
        setSelectedGradeId(null);
    };

    const handleCloseAddStudentModal = () => {
        setShowAddStudentModal(false);
        setSelectedGradeId(null);
    };

    const gradeFields = [
        { label: 'Name', value: (grade) => grade.name },
        { label: 'School', value: (grade) => grade.school_name || 'N/A' },
        { label: 'Teacher', value: (grade) => grade.teacher_name || 'N/A' },
        { label: 'Student Count', value: (grade) => grade.student_count || 'N/A' },
    ];

    const handleRowClick = (grade) => {
        setSelectedGrade(grade);
    };

    const handleCloseModal = () => {
        setSelectedGrade(null);
    };

    const handleAddStudent = async (studentIds) => {
        try {
            const studentIdsArray = Array.isArray(studentIds) ? studentIds : [studentIds];
            
            const promises = studentIdsArray.map(studentId =>
                fetch(`http://127.0.0.1:8000/school/grades/${selectedGradeId}/student/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${userToken}`,
                    },
                    body: JSON.stringify({ student_id: studentId }),
                })
            );

            const results = await Promise.all(promises);

            if (results.every(response => response.ok)) {
                toast.success('Students successfully added to grade');
                handleCloseAddStudentModal();
                // You might want to implement a function to refresh the grades data here
            } else {
                toast.error('Failed to add one or more students to grade');
            }
        } catch (error) {
            console.error('Error adding students to grade:', error);
            toast.error('An error occurred while adding students');
        }
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                School
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Teacher
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {currentGrades.map((grade) => (
                            <tr
                                key={grade.id}
                                onClick={() => handleRowClick(grade)}
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {grade.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {grade.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {grade.school_name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {grade.teacher_name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={(e) => handleShowAssignTeacherModal(e, grade.id)}
                                        className="mr-2 p-1 bg-blue-500 text-white rounded"
                                        title="Assign Teacher"
                                    >
                                        <FiUserCheck />
                                    </button>
                                    <button
                                        onClick={(e) => handleShowAddStudentModal(e, grade.id)}
                                        className="mr-2 p-1 bg-green-500 text-white rounded"
                                        title="Add Student"
                                    >
                                        <FiUserPlus />
                                    </button>
                                    {userRole === 'school' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteGrade(grade.id);
                                            }}
                                            className="p-1 bg-red-500 text-white rounded"
                                            title="Delete Grade"
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

            {showAssignTeacherModal && (
                <AssignTeacherModal
                    gradeId={selectedGradeId}
                    schoolId={grades.find(grade => grade.id === selectedGradeId)?.school}
                    onAssignTeacher={onAssignTeacher}
                    userToken={userToken}
                    onClose={handleCloseAssignTeacherModal}
                />
            )}

            {showAddStudentModal && (
                <AddStudentModal
                    gradeId={selectedGradeId}
                    schoolId={grades.find(grade => grade.id === selectedGradeId)?.school}
                    onAddStudent={handleAddStudent}
                    userToken={userToken}
                    onClose={handleCloseAddStudentModal}
                />
            )}

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
            {selectedGrade && (
                <ProfileModal
                    title="Grade Profile"
                    data={selectedGrade}
                    fields={gradeFields}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default GradeList;