import React, { useEffect, useState, useContext } from 'react'
import { TeacherContext } from '../contexts/teachercontext'
import AddStudentForm from '../forms/AddStudentForm'

const StudentPage = () => {
  const [students, setStudents] = useState([])
  const { teacher } = useContext(TeacherContext)
  console.log(teacher)

  useEffect(() => {
    if (teacher && teacher.grade) {
      console.log('teacher.grade:', teacher.grade)
      fetch(`http://127.0.0.1:8000/school/students/?grade=${teacher.grade}`)
        .then(response => response.json())
        .then(data => {
          setStudents(data)
          console.log(data)
        })
        .catch(error => console.error('Error:', error))
    }
  }, [teacher])

  if (!teacher || !teacher.grade) {
    return (
      <div className="bg-gray-200 dark:bg-gray-800 text-center p-6 rounded-md shadow-md">
        <p className="text-2xl font-bold mb-4 text-gray-800  dark:text-white">
          You ({teacher.first_name} {teacher.last_name}) are not assigned to a grade yet.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        StudentPage
      </h1>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="py-2 px-4 text-left text-gray-800 dark:text-white">
              First Name
            </th>
            <th className="py-2 px-4 text-left text-gray-800 dark:text-white">
              Last Name
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 dark:border-gray-600"
            >
              <td className="py-2 px-4 text-gray-800 dark:text-white">
                {student.first_name}
              </td>
              <td className="py-2 px-4 text-gray-800 dark:text-white">
                {student.last_name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6">
        <AddStudentForm disabled={!teacher || !teacher.grade} />
      </div>
    </div>
  )
}

export default StudentPage
