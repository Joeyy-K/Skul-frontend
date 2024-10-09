import React, { useEffect, useState } from 'react';
import { useTeacherData } from '../contexts/useTeacherData';
import CreateStudentProfile from '../forms/CreateStudentProfile';
import Cookies from 'js-cookie';
import Avatar from '../../../components/shared/Avatars';
import { FiLoader, FiUserPlus, FiSearch } from 'react-icons/fi';
import ProfileModal from '../components/ProfileModal';
import { API_URL } from '../../../components/url/url';

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { teacher, loading: teacherLoading } = useTeacherData();
  const userToken = Cookies.get('userToken');

  useEffect(() => {
    const fetchStudents = async () => {
      if (teacher && teacher.grade) {
        try {
          const response = await fetch(`${API_URL}/school/grades/${teacher.grade}/students/`, {
            headers: {
              'Authorization': `Token ${userToken}`,
            },
          });
          const data = await response.json();
          setStudents(data);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    if (!teacherLoading) {
      fetchStudents();
    }
  }, [teacher, userToken, teacherLoading]);

  const handleAddStudent = (newStudent) => {
    setStudents([...students, newStudent]);
  };

  const filteredStudents = students.filter(student => 
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const closeProfileModal = () => {
    setSelectedStudent(null);
  };

  const studentFields = [
    { label: 'First Name', value: (data) => data.first_name },
    { label: 'Last Name', value: (data) => data.last_name },
    { label: 'Email', value: (data) => data.user.email },
    { label: 'School', value: (data) => data.school_name },
    { label: 'Grade', value: (data) => data.grade_name },
  ];

  if (teacherLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-800">
        <FiLoader className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (!teacher || !teacher.grade) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-2xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">
          Not Assigned to a Grade
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          You ({teacher?.first_name} {teacher?.last_name}) are not assigned to a grade yet.
          Please contact your administrator for assignment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Student In Your Grade</h1>
        
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6 flex justify-between items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                className="pl-10 pr-4 py-2 border rounded-full text-gray-700 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              onClick={() => document.getElementById('addStudentForm').scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center transition duration-300"
            >
              <FiUserPlus className="mr-2" />
              Add New Student
            </button>
          </div>

          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStudents.map((student) => (
                    <tr 
                      key={student.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 cursor-pointer"
                      onClick={() => handleStudentClick(student)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Avatar
                          avatarUrl={student.user?.avatar_url}
                          name={`${student.first_name} ${student.last_name}`}
                          size={32}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{student.grade_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No students found matching your search.</p>
          )}
        </div>

        <div id="addStudentForm" className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Add New Student</h2>
          <CreateStudentProfile onAddStudent={handleAddStudent} />
        </div>
      </div>

      {selectedStudent && (
        <ProfileModal
          title="Student Profile"
          data={selectedStudent}
          fields={studentFields}
          onClose={closeProfileModal}
        />
      )}
    </div>
  );
};

export default StudentPage;