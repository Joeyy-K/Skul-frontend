import React, { useState } from 'react';
import Cookies from 'js-cookie';

const StudentList = ({ students, selectedGrade, onBackToGrades, onStudentUpdate }) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const userToken = Cookies.get('userToken');

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, students.length);

    const totalPages = Math.ceil(students.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const unassignStudent = (studentId) => {
        fetch(`http://127.0.0.1:8000/school/unassign-student/${studentId}/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${userToken}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            onStudentUpdate();
        })
        .catch(error => console.error('Error:', error));
    };

    const deleteStudent = (studentId) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            fetch(`http://127.0.0.1:8000/school/delete-student/${studentId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${userToken}`,
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                onStudentUpdate();
            })
            .catch(error => console.error('Error:', error));
        }
    };

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 p-2">
                    {selectedGrade.id === 'all' ? 'All Students' : `Students in ${selectedGrade.name}`}
                </h2>
                <button
                    onClick={onBackToGrades}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
                >
                    Back to Grades
                </button>
            </div>
            {students.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-gray-700">
                                <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">ID</th>
                                <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">Name</th>
                                <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">School</th>
                                <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">Grade</th>
                                <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.slice(startIndex, endIndex).map((student) => (
                                <tr key={student.id} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{student.id}</td>
                                    <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                                        {student.first_name} {student.last_name}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                                        {student.school_name}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                                        {student.grade_name || 'Not Assigned'}
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => unassignStudent(student.id)}
                                            className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded"
                                        >
                                            Unassign
                                        </button>
                                        {userToken && Cookies.get('role') === 'school' && (
                                            <button
                                                onClick={() => deleteStudent(student.id)}
                                                className="px-2 py-1 bg-red-500 text-white rounded"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="mr-2 px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                            >
                                Previous
                            </button>
                            <span className="mx-2">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="ml-2 px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-black dark:text-gray-400 p-2">
                    {selectedGrade.id === 'all' ? 'No students found.' : 'No students found in this grade.'}
                </p>
            )}
        </div>
    );
};

export default StudentList;