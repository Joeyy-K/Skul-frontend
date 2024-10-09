import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { API_URL } from '../../../components/url/url';

const AssignmentSubmissionStatus = ({ assignmentId }) => {
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    const fetchSubmissionStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/school/assignments/${assignmentId}/submission-status/`, {
          headers: {
            'Authorization': `Token ${Cookies.get('userToken')}`
          }
        });
        const data = await response.json();
        setSubmissionStatus(data);
      } catch (error) {
        console.error('Error fetching submission status:', error);
      }
    };

    fetchSubmissionStatus();
  }, [assignmentId]);

  if (!submissionStatus) return <p>Loading assignment data...</p>;

  const totalStudents = submissionStatus.students.length;
  const submittedCount = submissionStatus.students.filter(student => student.has_submitted).length;

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
      <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{submissionStatus.title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{submissionStatus.description}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Due: {new Date(submissionStatus.due_date).toLocaleString()}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-600 p-3 rounded-md shadow">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{totalStudents}</p>
        </div>
        <div className="bg-white dark:bg-gray-600 p-3 rounded-md shadow">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Submissions</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{submittedCount}</p>
        </div>
      </div>
      <div className="mt-4">
        <h5 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">Student Submissions</h5>
        <ul className="space-y-2">
          {submissionStatus.students.map(student => (
            <li key={student.id} className="flex justify-between items-center bg-white dark:bg-gray-600 p-2 rounded-md">
              <span className="text-gray-800 dark:text-gray-200">{student.first_name} {student.last_name}</span>
              {student.has_submitted ? (
                <span className="text-green-600 dark:text-green-400">Submitted: {new Date(student.submission_date).toLocaleString()}</span>
              ) : (
                <span className="text-red-600 dark:text-red-400">Not submitted</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AssignmentSubmissionStatus;