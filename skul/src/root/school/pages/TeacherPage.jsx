import React, { useState, useEffect, useContext } from 'react';
import { SchoolContext } from "../context/schoolcontext";
import Cookies from 'js-cookie';
import CreateTeacherForm from '../forms/CreateTeacherForm';

function TeacherPage() {
  const [teachers, setTeachers] = useState([]);
  const { school } = useContext(SchoolContext);
  const userToken = Cookies.get('userToken');

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/school/teachers/`, {
      headers: {
        'Authorization': `Token ${userToken}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        const schoolTeachers = data.filter(teacher => teacher.school === school.id);
        setTeachers(schoolTeachers);
        console.log(schoolTeachers);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const handleAddTeacher = (newTeacher) => {
    setTeachers([...teachers, newTeacher]);
  };

  return (
    <div>
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
                      Full Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Channel
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                  {teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {teacher.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {teacher.first_name} {teacher.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {teacher.user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {teacher.grade ? teacher.grade : 'No grade assigned'}
                      </td>
                      <td className="px-6 py -4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {teacher.user.channel ? teacher.user.channel.name : 'No channel assigned'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <CreateTeacherForm onAddTeacher={handleAddTeacher} />
    </div>
  );
}

export default TeacherPage;