import React, { useState } from 'react';

const GradeList = ({ grades, onGradeSelect }) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const allGradesOption = { id: 'all', name: 'All Students' };
    const allGrades = [allGradesOption, ...grades];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, allGrades.length);

    const totalPages = Math.ceil(allGrades.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="bg-gray-200 dark:bg-gray-800 p-4">
            <h2 className="text-gray-700 dark:text-gray-100 mb-2">Grades</h2>
            {allGrades.slice(startIndex, endIndex).map((grade) => (
                <div
                    key={grade.id}
                    onClick={() => onGradeSelect(grade)}
                    className="cursor-pointer py-2 px-4 rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 mb-2 text-gray-800 dark:text-gray-200"
                >
                    {grade.name}
                </div>
            ))}

            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="mr-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
                    >
                        Previous
                    </button>
                    <span className="mx-2 dark:text-white">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="mr-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default GradeList;