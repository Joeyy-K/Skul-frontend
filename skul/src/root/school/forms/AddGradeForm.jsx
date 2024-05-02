import React, { useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { UserContext } from '../../../contexts/UserContext';

function AddGradeForm({ onAddGrade }) {
    const [gradeName, setGradeName] = useState('');
    const { user } = useContext(UserContext);

    let userToken = Cookies.get('userToken');

    const handleSubmit = (e) => {
        e.preventDefault();
        const schoolId = user.id; 
      
        fetch('http://127.0.0.1:8000/school/grades/', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${userToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: gradeName, school: schoolId }),
        })
          .then(response => response.json())
          .then(data => {
            onAddGrade(data);
            setGradeName('');
          })
          .catch(error => {
            console.error('Error:', error);
          });
      };
      
    return (
         <div className="bg-white px-10 p-7 mx-auto rounded dark:bg-gray-700">
            <form onSubmit={handleSubmit}>
                <input
                type="text"
                value={gradeName}
                onChange={e => setGradeName(e.target.value)}
                placeholder="Enter grade name"
                className="border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none focus:border-green-400 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
                />
                <button type="submit" className="py-2 px-4 mt-2 bg-blue-500 text-white font-bold rounded dark:bg-blue-400">Add Grade</button>
            </form>
        </div>
        );
}

export default AddGradeForm;