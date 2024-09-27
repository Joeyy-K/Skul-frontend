import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const SubmittedAssignments = ({ assignmentId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://127.0.0.1:8000/school/assignment-submissions/?assignment=${assignmentId}`, {
          headers: {
            'Authorization': `Token ${Cookies.get('userToken')}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setError('Failed to load submissions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  if (loading) return <p>Loading submissions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
      <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Submitted Assignments</h4>
      {submissions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No submissions yet.</p>
      ) : (
        <ul className="space-y-4">
          {submissions.map((submission) => (
            <li key={submission.id} className="bg-white dark:bg-gray-600 p-4 rounded-md shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Student Name: {submission.student_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Submitted on: {new Date(submission.submission_date).toLocaleString()}
                  </p>
                </div>
                <a
                  href={submission.file}
                  download
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition duration-300 ease-in-out"
                >
                  Download
                </a>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                  File: {submission.file.split('/').pop()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubmittedAssignments;