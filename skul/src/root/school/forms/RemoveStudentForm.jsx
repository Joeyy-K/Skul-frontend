import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { API_URL } from '../../../components/url/url';

function RemoveStudentForm({ gradeId }) {
  const [studentId, setStudentId] = useState('');
  let userToken = Cookies.get('userToken');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/school/grades/${gradeId}/remove-student/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student_id: studentId }),
    })
      .then((response) => {
        if (response.ok) {
          setStudentId('');
        } else {
          throw new Error('Response not OK');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        placeholder="Enter student ID"
        className="border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none focus:border-green-400 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
      />
      <button
        type="submit"
        className="py-2 px-4 mt-2 bg-red-500 text-white font-bold rounded dark:bg-red-400"
      >
        Remove Student
      </button>
    </form>
  );
}

export default RemoveStudentForm;