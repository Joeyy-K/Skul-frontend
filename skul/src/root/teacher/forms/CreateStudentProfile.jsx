import React, { useState, useEffect } from 'react';
import { useTeacherData } from '../contexts/useTeacherData';
import Cookies from 'js-cookie';
import { API_URL } from '../../../components/url/url';

const CreateStudentProfile = ({ onAddStudent  }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gradeId, setGradeId] = useState('');
  const { teacher, loading } = useTeacherData();
  const [schoolId, setSchoolId] = useState('');
  
  let userToken = Cookies.get('userToken');

  useEffect(() => {
    if (teacher) {
      setSchoolId(teacher.school);
      setGradeId(teacher.grade);
    }
  }, [teacher]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !username || !password || !email || !schoolId) {
      console.error('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/school/register_student/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${userToken}`
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          username,
          password,
          email,
          school: parseInt(teacher.school, 10),
          grade: parseInt(teacher.grade, 10)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onAddStudent(data);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setSchoolId('');
        setGradeId('');
      } else {
        console.error('Failed to create student profile');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    (
      <div>loading...</div>
    );
  }

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-6">
        Create Student Profile
      </h2>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-600 p-4 rounded-lg shadow-md">
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-gray-700 font-bold mb-2 dark:text-gray-300"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="shadow-sm bg-gray-100 border border-gray-300 dark:border-none text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 dark:bg-gray-700 dark:text-white block w-full p-2.5"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-gray-700 font-bold mb-2 dark:text-gray-300"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="shadow-sm bg-gray-100 border border-gray-300 dark:border-none text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 dark:bg-gray-700 dark:text-white block w-full p-2.5"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-bold mb-2 dark:text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow-sm bg-gray-100 border border-gray-300 dark:border-none text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 dark:bg-gray-700 dark:text-white block w-full p-2.5"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 font-bold mb-2 dark:text-gray-300"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow-sm bg-gray-100 border border-gray-300 dark:border-none text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 dark:bg-gray-700 dark:text-white block w-full p-2.5"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2 dark:text-gray-300"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow-sm bg-gray-100 border border-gray-300 dark:border-none text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 dark:bg-gray-700 dark:text-white block w-full p-2.5"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="schoolId"
            className="block text-gray-700 font-bold mb-2 dark:text-gray-300"
          >
            School
          </label>
          <input
            type="text"
            id="schoolId"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            className="shadow-sm bg-gray-100 border border-gray-300 dark:border-none text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 dark:bg-gray-700 dark:text-white block w-full p-2.5"
            disabled
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="gradeId"
            className="block text-gray-700 font-bold mb-2 dark:text-gray-300"
          >
            Grade
          </label>
          <input
            type="text"
            id="gradeId"
            value={gradeId}
            onChange={(e) => setGradeId(e.target.value)}
            className="shadow-sm bg-gray-100 border border-gray-300 dark:border-none text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 dark:bg-gray-700 dark:text-white block w-full p-2.5"
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Create Student Profile
        </button>
      </form>
    </div>
  );
};

export default CreateStudentProfile;