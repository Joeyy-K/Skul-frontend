import React, { useState, useEffect } from 'react';

function Stepfour({ schoolId, setSchoolId }) {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/school/schools/')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setSchools(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div>
        <label className="block mb-2 text-base font-bold text-gray-700 dark:text-white">School:</label>
        <select value={schoolId} onChange={e => setSchoolId(Number(e.target.value))}>
  <option value="">Select a school</option>
  {schools.map(school => (
    <option key={school.id} value={school.id}>{school.full_name}</option>
  ))}
</select>

    </div>
  )
}

export default Stepfour;

