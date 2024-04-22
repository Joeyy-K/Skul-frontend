import React, { useEffect, useState, useContext } from 'react'
import Cookies from 'js-cookie'
import { TeacherContext } from '../contexts/teachercontext'

function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([])
  const [newFeedback, setNewFeedback] = useState('')
  const { teacher } = useContext(TeacherContext)
  const token = Cookies.get('userToken')
  console.log(teacher)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/school/feedbacks/', {
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
    .then(response => response.json())
    .then(data => setFeedbacks(data))
    .catch(error => console.error(error))
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    fetch('http://127.0.0.1:8000/school/feedbacks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({ 
        content: newFeedback,
        sender: teacher.id,
        receiver: teacher.school 
      }),
    })
    .then(response => response.json())
    .then(data => {
      setFeedbacks([...feedbacks, data])
      setNewFeedback('')
    })
    .catch(error => console.error(error))
  }
  
  const handleDelete = (feedbackId) => {
    fetch(`http://127.0.0.1:8000/school/feedbacks/${feedbackId}/delete/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
    .then(() => {
      setFeedbacks(feedbacks.filter(feedback => feedback.id !== feedbackId))
    })
    .catch(error => console.error(error))
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        FeedbackPage
      </h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newFeedback}
          onChange={e => setNewFeedback(e.target.value)}
          className="w-full p-20 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 dark:bg-indigo-700 dark:hover:bg-indigo-800"
        >
          Submit Feedback
        </button>
      </form>
      {feedbacks.map(feedback => (
        
        <div
          key={feedback.content}
          className="bg-gray-200 dark:bg-gray-700 p-4 rounded-md mb-4"
        >
          <button
            onClick={() => handleDelete(feedback.id)}
            className="mb-1 px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
          >
            <svg className="w-4 h-4" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" fill="#000000">
                      <g id="icons" transform="translate(56.000000, 160.000000)">
                          <path d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z" id="delete-[#1487]">
                          </path>
                      </g>
                  </g>
              </g>
          </svg>
          </button>
          <p className="text-gray-800 dark:text-white">{feedback.content}</p>
        </div>
      ))}
    </div>
  )
}

export default FeedbackPage
