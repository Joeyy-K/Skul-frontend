import React, { useState, useEffect, useContext } from 'react'
import { TeacherContext } from '../contexts/teachercontext'
import Cookies from 'js-cookie'

function Assignment({ assignment, onDelete }) {
  const handleDelete = () => {
    fetch(`http://127.0.0.1:8000/school/assignments/${assignment.id}/`, {
      method: 'DELETE',
    })
    .then(() => {
      onDelete(assignment.id)
    })
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-700 p-5 rounded-md">
      <h2 className="text-lg text-gray-700 dark:text-white mb-2">{assignment.title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{assignment.description}</p>
      <iframe src={assignment.file} className="w-full h-64 border-none" />
      <a
        href={assignment.file}
        download
        className="mt-4 px-4 py-2 mr-3 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        Download
      </a>
      <button
        onClick={handleDelete}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
      >
        Remove
      </button>    
    </div>
  )
}


function AssignmentList({ assignments, onDelete }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Your Assignments
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map(assignment => (
          <Assignment key={assignment.id} assignment={assignment} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}

function AssignmentForm({ onCreate }) {
  const { teacher } = useContext(TeacherContext)
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    due_date: '',
    grade: '',
    teacher: teacher ? teacher.id : null,
    file: null,
  })

  const handleChange = (event) => {
    if (event.target.name === 'file') {
      setNewAssignment({ ...newAssignment, file: event.target.files[0] })
    } else {
      setNewAssignment({ ...newAssignment, [event.target.name]: event.target.value })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData()
    Object.keys(newAssignment).forEach(key => {
      formData.append(key, newAssignment[key])
    })
    fetch('http://127.0.0.1:8000/school/assignments/', {
      method: 'POST',
      body: formData,
    })
    .then(async response => {
      if (!response.ok) {
        const error = await response.json()
        throw error
      }
      return response.json();
    })
    .then(data => onCreate(data))
    .catch(error => {
      alert(`Error: ${error.file}`);
    });
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-md shadow-md mb-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Create New Assignment
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-800 dark:text-white font-bold mb-2" htmlFor="title">
            Title:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            name="title"
            type="text"
            placeholder="Enter assignment title"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 dark:text-white font-bold mb-2" htmlFor="description">
            Description:
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            placeholder="Enter assignment description"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 dark:text-white font-bold mb-2" htmlFor="due_date">
            Due Date:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="due_date"
            name="due_date"
            type="datetime-local"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 dark:text-white font-bold mb-2" htmlFor="file">
            File:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="file"
            name="file"
            type="file"
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 dark:text-white font-bold mb-2" htmlFor="grade">
            Grade:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="grade"
            name="grade"
            type="text"
            placeholder="Enter grade"
            onChange={handleChange}
          />
        </div>
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-indigo-700 dark:hover:bg-indigo-800"
          type="submit"
        >
          Create
        </button>
      </form>
    </div>
  )
}

function AssignmentPage() {
  const [assignments, setAssignments] = useState([])
  let userToken = Cookies.get('userToken');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/school/assignments/', {
      headers: {
        'Authorization': `Token ${userToken}`
      }
    })
    .then(response => response.json())
    .then(data => setAssignments(data));
  }, [])

  const handleDelete = (id) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id))
  }

  const handleCreate = (newAssignment) => {
    setAssignments(prevAssignments => [...prevAssignments, newAssignment])
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-md shadow-md">
      <AssignmentForm onCreate={handleCreate} />
      <AssignmentList assignments={assignments} onDelete={handleDelete} />
    </div>
  )
}

export default AssignmentPage

