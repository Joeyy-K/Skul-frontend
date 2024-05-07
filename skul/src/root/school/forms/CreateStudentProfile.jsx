import React, { useState,useContext } from 'react';
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
  const { school } = useContext(SchoolContext)

  console.log(school)

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/school/register_student/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'student',
          first_name: firstName,
          last_name: lastName,
          user: {
            username,
            password,
            email,
          },
          school: schoolId,
          grade: gradeId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onAddStudent(data.user); 
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
    <div className="bg-white px-10 p-7 mx-auto rounded dark:bg-gray-700">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Create Student Profile
      </h2>
      <form onSubmit={handleSubmit}>
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
            className="border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none focus:border-green-400 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
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
            className="border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none focus:border-green-400 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
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
            className="border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none focus:border-green-400 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
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
            className="border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none focus:border-green-400 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
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
            className="border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none focus:border-green-400 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
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
            className="border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none focus:border-green-400 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
          />
        </div>
        <div className="mb-4">
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
            className="border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none focus:border-green-400 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white font-bold rounded dark:bg-blue-400"
        >
          Create Student Profile
        </button>
      </form>
    </div>
  );
};

export default CreateStudentProfile;