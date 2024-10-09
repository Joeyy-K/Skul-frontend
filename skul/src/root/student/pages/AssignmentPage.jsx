import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useStudentData } from '../context/useStudentData';
import { API_URL } from '../../../components/url/url';

const AssignmentPage = () => {
    const { student, loading } = useStudentData();
    const userToken = Cookies.get('userToken');
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionFile, setSubmissionFile] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState({});

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
        const response = await fetch(`${API_URL}/school/assignments/`, {
            headers: {
            'Authorization': `Token ${userToken}`
            }
        });
        const data = await response.json();
        setAssignments(data);
        } catch (error) {
        console.error('Error fetching assignments:', error);
        }
    };

    const fetchSubmissionStatus = async (assignmentId) => {
        try {
        const response = await fetch(`${API_URL}/school/assignments/${assignmentId}/submission-status/`, {
            headers: {
            'Authorization': `Token ${userToken}`
            }
        });
        const data = await response.json();
        setSubmissionStatus(prevStatus => ({...prevStatus, [assignmentId]: data}));
        } catch (error) {
        console.error('Error fetching submission status:', error);
        }
    };

    const handleFileChange = (event) => {
        setSubmissionFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedAssignment || !submissionFile) return;

        const formData = new FormData();
        formData.append('assignment', selectedAssignment.id);
        formData.append('student', student.id);
        formData.append('file', submissionFile);

        try {
        const response = await fetch(`${API_URL}/school/assignment-submissions/`, {
            method: 'POST',
            headers: {
            'Authorization': `Token ${userToken}`
            },
            body: formData
        });
        if (response.ok) {
            alert('Assignment submitted successfully!');
            setSubmissionFile(null);
            fetchSubmissionStatus(selectedAssignment.id);
        } else {
            alert('Failed to submit assignment. Please try again.');
        }
        } catch (error) {
        console.error('Error submitting assignment:', error);
        alert('An error occurred while submitting the assignment.');
        }
    };

    if (loading) {
        return (
            <div>loading...</div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-100 dark:bg-gray-800 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Assignments</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Assignment List</h2>
            <ul className="space-y-2">
                {assignments.map((assignment) => (
                <li 
                    key={assignment.id} 
                    className={`p-2 rounded cursor-pointer ${
                    selectedAssignment && selectedAssignment.id === assignment.id 
                        ? 'bg-blue-100 dark:bg-blue-800' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                    } text-gray-800 dark:text-gray-200`}
                    onClick={() => {
                    setSelectedAssignment(assignment);
                    fetchSubmissionStatus(assignment.id);
                    }}
                >
                    {assignment.title}
                </li>
                ))}
            </ul>
            </div>
            <div className="md:col-span-2 bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
            {selectedAssignment ? (
                <>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{selectedAssignment.title}</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">{selectedAssignment.description}</p>
                <p className="mb-4 text-gray-700 dark:text-gray-300">Due: {new Date(selectedAssignment.due_date).toLocaleString()}</p>
                {selectedAssignment.file && (
                    <a 
                    href={selectedAssignment.file} 
                    download 
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block"
                    >
                    Download attachment
                    </a>
                )}
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Submit Assignment</h3>
                <form onSubmit={handleSubmit} className="mb-6">
                    <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="mb-2 text-gray-700 dark:text-gray-300"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    />
                    <button 
                    type="submit" 
                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={!submissionFile}
                    >
                    Submit Assignment
                    </button>
                </form>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Submission Status</h3>
                {submissionStatus[selectedAssignment.id] ? (
                    <div>
                    {submissionStatus[selectedAssignment.id].students
                        .filter(s => s.id === student.id)
                        .map(s => (
                        <p key={s.id} className="text-gray-700 dark:text-gray-300">
                            Status: {s.has_submitted ? 'Submitted' : 'Not Submitted'}
                            {s.has_submitted && ` on ${new Date(s.submission_date).toLocaleString()}`}
                        </p>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-700 dark:text-gray-300">Loading submission status...</p>
                )}
                </>
            ) : (
                <p className="text-gray-700 dark:text-gray-300">Select an assignment to view details and submit.</p>
            )}
            </div>
        </div>
        </div>
    );
};

export default AssignmentPage;