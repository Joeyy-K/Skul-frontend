import React from 'react';

const StudentList = ({ students, selectedGrade, onBackToGrades }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 p-2">
          Students in {selectedGrade.name}
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
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{student.id}</td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                    {student.school_name}
                  </td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                    {student.grade_name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-black dark:text-gray-400 p-2">No students found in this grade.</p>
      )}
    </div>
  );
};

export default StudentList;