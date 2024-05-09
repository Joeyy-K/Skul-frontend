import React, { useState, useContext } from 'react';
import { SchoolContext } from '../context/schoolcontext';
import Cookies from 'js-cookie';

const CreateStudentProfile = ({ onAddStudent }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [gradeId, setGradeId] = useState('');
  const { school } = useContext(SchoolContext);

  let userToken = Cookies.get('userToken');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !username || !password || !email || !schoolId) {
      console.error('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/school/register_student/', {
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
          school: parseInt(school.id, 10),
          grade: gradeId ? parseInt(gradeId, 10) : null,
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

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-6">
        Create Student Profile
      </h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
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
            className="w-full px-4 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
            className="w-full px-4 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
            className="w-full px-4 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
            className="w-full px-4 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
            className="w-full px-4 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
            value={school.id}
            onChange={(e) => setSchoolId(e.target.value)}
            className="w-full px-4 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
            className="w-full px-4 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
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