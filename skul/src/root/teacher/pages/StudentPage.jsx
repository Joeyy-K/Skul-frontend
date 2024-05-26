import React, { useEffect, useState, useContext } from 'react';
import { TeacherContext } from '../contexts/teachercontext';
import AddStudentForm from '../forms/AddStudentForm';
import Cookies from 'js-cookie';

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const { teacher } = useContext(TeacherContext);
  console.log(teacher);
  let userToken = Cookies.get('userToken');

  useEffect(() => {
    if (teacher && teacher.grade) {
      fetch(`http://127.0.0.1:8000/school/grades/${teacher.grade}/students/`, {
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setStudents(data);
          console.log(data);
        })
        .catch(error => console.error('Error:', error));
    }
  }, [teacher]);

  if (!teacher || !teacher.grade) {
    return (
      <div className="bg-gray-200 dark:bg-gray-800 text-center p-6 rounded-md shadow-md">
        <p className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          You ({teacher?.first_name} {teacher?.last_name}) are not assigned to a grade yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">StudentPage</h1>
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
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{student.user.id}</td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{student.school_name}</td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{student.grade_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No students found in this grade.</p>
      )}
      <div className="mt-6">
        <AddStudentForm disabled={!teacher || !teacher.grade} />
      </div>
    </div>
  );
};

export default StudentPage;