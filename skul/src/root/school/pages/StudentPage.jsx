import React, { useState, useEffect, useContext } from 'react';
import CreateStudentProfile from '../forms/CreateStudentProfile';
import { UserContext } from "../../../contexts/UserContext";
import { SchoolContext } from "../context/schoolcontext";
import Cookies from 'js-cookie';

function StudentsPage() {
    const { user } = useContext(UserContext);
    const { school } = useContext(SchoolContext);
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState([]);

    let userToken = Cookies.get('userToken');

    useEffect(() => {
        if (school) {
        fetchStudents();
        fetchGrades();
        }
    }, [school]);

    const fetchStudents = () => {
        fetch(`http://127.0.0.1:8000/school/students/?school_id=${school.id}`, {
          headers: {
            'Authorization': `Token ${userToken}`,
          },
        })
          .then(response => response.json())
          .then(data => setStudents(data))
          .catch(error => {
            console.error('Error:', error);
          });
      };
      
    const fetchGrades = () => {
        fetch(`http://127.0.0.1:8000/school/grades/?school_id=${school.id}`, {
          headers: {
            'Authorization': `Token ${userToken}`,
          },
        })
          .then(response => response.json())
          .then(data => setGrades(data))
          .catch(error => {
            console.error('Error:', error);
          });
      };

    const handleAddStudent = (newStudent) => {
        setStudents([...students, newStudent]);
    };

    return (
        <div className="dark:bg-gray-800">
        <div className="flex flex-col mt-6 mb-6">
            <div className="-my-2 overflow-x-auto">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                    {students.map((student) => (
                        <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {student.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {student.first_name} {student.last_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {grades.find(grade => grade.id === student.grade)?.name}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        </div>
        <CreateStudentProfile onAddStudent={handleAddStudent} />
        </div>
  );
}

export default StudentsPage;