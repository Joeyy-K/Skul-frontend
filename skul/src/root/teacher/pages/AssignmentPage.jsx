import React, { useState, useEffect, useContext } from 'react';
import { useTeacherData } from '../contexts/useTeacherData';
import { TeacherContext } from '../contexts/teachercontext';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import AssignmentSubmissionStatus from '../components/AssignmentSubmissionStatus';
import SubmittedAssignments from '../components/SubmittedAssignments';

function Assignment({ assignment, onDelete }) {
  const [showSubmissionStatus, setShowSubmissionStatus] = useState(false);
  const [showSubmittedAssignments, setShowSubmittedAssignments] = useState(false);

  const handleDelete = () => {
    fetch(`http://127.0.0.1:8000/school/assignments/${assignment.id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${Cookies.get('userToken')}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete assignment');
      }
      onDelete(assignment.id);
      toast.success('Assignment deleted successfully');
    })
    .catch(error => {
      console.error('Error:', error);
      toast.error('Failed to delete assignment');
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{assignment.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Grade: {assignment.grade}</p>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{assignment.description}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Due: {new Date(assignment.due_date).toLocaleString()}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {assignment.file && (
          <a 
            href={assignment.file} 
            download 
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Download attachment
          </a>
        )}
        <button 
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Remove
        </button>
        <button 
          onClick={() => setShowSubmissionStatus(!showSubmissionStatus)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          {showSubmissionStatus ? 'Hide' : 'Show'} Submission Status
        </button>
        <button 
          onClick={() => setShowSubmittedAssignments(!showSubmittedAssignments)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {showSubmittedAssignments ? 'Hide' : 'View'} Submitted Assignments
        </button>
      </div>
      {showSubmissionStatus && <AssignmentSubmissionStatus assignmentId={assignment.id} />}
      {showSubmittedAssignments && (
        <SubmittedAssignments assignmentId={assignment.id} />
      )}
    </div>
  );
}

function AssignmentForm({ onCreate, grades }) {
  const { teacher } = useContext(TeacherContext);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    due_date: '',
    grade: '',
    teacher: teacher ? teacher.id : null,
    file: null,
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setNewAssignment(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.keys(newAssignment).forEach(key => {
      formData.append(key, newAssignment[key]);
    });

    fetch('http://127.0.0.1:8000/school/assignments/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${Cookies.get('userToken')}`
      },
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      onCreate(data);
      setNewAssignment({
        title: '',
        description: '',
        due_date: '',
        grade: '',
        teacher: teacher ? teacher.id : null,
        file: null,
      });
    })
    .catch(error => alert(`Error: ${JSON.stringify(error)}`));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Create New Assignment</h2>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="title">
          Title
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="title"
          name="title"
          type="text"
          value={newAssignment.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          name="description"
          value={newAssignment.description}
          onChange={handleChange}
          required
          rows="4"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="due_date">
          Due Date
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="due_date"
          name="due_date"
          type="datetime-local"
          value={newAssignment.due_date}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="grade">
          Grade
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          name="grade"
          value={newAssignment.grade}
          onChange={handleChange}
          required
        >
          <option value="">Select a grade</option>
          {grades.map(grade => (
            <option key={grade.id} value={grade.id}>
              {grade.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="file">
          File
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="file"
          name="file"
          type="file"
          onChange={handleChange}
        />
      </div>
      <button 
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
      >
        Create Assignment
      </button>
    </form>
  );
}

function AssignmentPage() {
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const { teacher, loading } = useTeacherData();
  const userToken = Cookies.get('userToken');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/school/assignments/', {
      headers: {
        'Authorization': `Token ${userToken}`
      }
    })
    .then(response => response.json())
    .then(data => setAssignments(data));

    if (teacher && teacher.school) {
      fetch(`http://127.0.0.1:8000/school/grades/?school_id=${teacher.school}`, {
        headers: {
          'Authorization': `Token ${userToken}`
        }
      })
      .then(response => response.json())
      .then(data => setGrades(data));
    }
  }, [teacher, userToken]);

  const handleDelete = (id) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
  };

  const handleCreate = (newAssignment) => {
    setAssignments(prevAssignments => [...prevAssignments, newAssignment]);
    setShowCreateForm(false);
  };

  if (loading) {
    return (
      <div>loading...</div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Assignment Management</h1>
      <button 
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mb-4"
      >
        {showCreateForm ? 'Hide Create Form' : 'Create New Assignment'}
      </button>
      {showCreateForm && <AssignmentForm onCreate={handleCreate} grades={grades} />}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Your Assignments</h2>
        {assignments.map(assignment => (
          <Assignment key={assignment.id} assignment={assignment} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default AssignmentPage;