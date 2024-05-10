import React, { useState, useEffect, useContext } from 'react';
import { SchoolContext } from "../context/schoolcontext";
import AddStudentForm from '../forms/AddStudentForm';
import AddGradeForm from '../forms/AddGradeForm';
import Cookies from 'js-cookie';

function GradesPage() {
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [teacherId, setTeacherId] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [schools, setSchools] = useState([]);
    const { school } = useContext(SchoolContext);

    let userToken = Cookies.get('userToken');

    useEffect(() => {
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
    
      fetch('http://127.0.0.1:8000/school/teachers/', {
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      })
        .then(response => response.json())
        .then(data => setTeachers(data))
        .catch(error => {
          console.error('Error:', error);
        });
    
      fetch('http://127.0.0.1:8000/school/schools/', {
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      })
        .then(response => response.json())
        .then(data => setSchools(data))
        .catch(error => {
          console.error('Error:', error);
        });
    }, []);

    const handleGradeClick = (grade) => {
      setSelectedGrade(grade);
    };

    const handleAddGrade = (newGrade) => {
      setGrades([...grades, newGrade]);
    };

    const handleAddTeacher = (e) => {
      e.preventDefault();
      fetch(`http://127.0.0.1:8000/school/grades/${selectedGrade.id}/teacher/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacher_id: teacherId }),
      })
        .then(response => response.json())
        .then(data => {
          setSelectedGrade({ ...selectedGrade, teacher: data });
          setTeacherId('');
        })
        .catch(error => {
          console.error('Error:', error);
        });
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
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        School
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
                    {grades.map((grade) => (
                      <tr key={grade.id} onClick={() => handleGradeClick(grade)} className="cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {grade.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {grade.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {schools.find(school => school.id === grade.school)?.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {teachers.find(teacher => teacher.id === grade.teacher) ? teachers.find(teacher => teacher.id === grade.teacher).first_name + ' ' + teachers.find(teacher => teacher.id === grade.teacher).last_name : 'No teacher assigned'}
                      </td>
                    </tr>                    
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <AddGradeForm onAddGrade={handleAddGrade} />
        {selectedGrade && (
         <div className="bg-white px-10 p-7  mx-auto rounded dark:bg-gray-700">
           <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{selectedGrade.name}</h2>
           <p className="text-sm text-gray-500 dark:text-gray-300">Teacher: {selectedGrade.teacher ? selectedGrade.teacher : 'No teacher assigned'}</p>
           <form onSubmit={handleAddTeacher} className="mb-4">
             <input
               type="text"
               value={teacherId}
               onChange={e => setTeacherId(e.target.value)}
               placeholder="Enter teacher ID"
               className="border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none focus:border-green-400 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
             />
             <button type="submit" className="py-2 px-4 mt-2 bg-blue-500 text-white font-bold rounded dark:bg-blue-400">Add Teacher</button>
           </form>
           <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Students</h3>
           <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-300">
             {selectedGrade && selectedGrade.students && selectedGrade.students.map(student => (
               <li key={student.id}>{student.full_name}</li>
             ))}
           </ul>
           <AddStudentForm gradeId={selectedGrade.id} />
           </div>
        )}
          </div>
        );
}

export default GradesPage;