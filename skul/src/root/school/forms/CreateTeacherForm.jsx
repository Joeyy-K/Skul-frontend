import React, { useState, useContext, useEffect } from 'react';
import { SchoolContext } from '../context/schoolcontext';
import Cookies from 'js-cookie';

const CreateTeacherForm = ({ onAddTeacher }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { school } = useContext(SchoolContext);
  const [schoolId, setSchoolId] = useState('');

  let userToken = Cookies.get('userToken');

  useEffect(() => {
    if (school) {
      setSchoolId(school.id);
    }
  }, [school]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !username || !password || !email || !schoolId) {
      console.error('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/school/register_teacher/', {
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
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onAddTeacher(data);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setUsername('');
      } else {
        console.error('Failed to create teacher profile');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-6">
        Create Teacher Profile
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
        <div className="mb-6">
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
            className="shadow-sm bg-gray-100 border border-gray-300 dark:border-none text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 dark:bg-gray-700 dark:text-white block w-full p-2.5"
            disabled
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Create Teacher Profile
        </button>
      </form>
    </div>
  );
};

export default CreateTeacherForm;