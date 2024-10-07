import React, { useState, useContext } from 'react'
import { useTeacherData } from '../contexts/useTeacherData'

const MessageForm = () => {
  const [content, setContent] = useState('');
  const { teacher, loading } = useTeacherData();

  const handleSubmit = (event) => {
    event.preventDefault()
    const messageData = {
      sender: teacher.id,
      channel: teacher.user.channel,
      content: content,
    }
    fetch('http://127.0.0.1:8000/school/messages/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data)
      setContent('')
    })
    .catch((error) => {
      console.error('Error:', error)
    })
  }

  if (loading) {
    return (
      <div>loading...</div>
    )
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-md shadow-md my-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Send a Message
      </h2>
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="shadow appearance-none border rounded-l-md w-full py-2 px-3 text-gray-800 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none focus:shadow-outline dark:bg-indigo-700 dark:hover:bg-indigo-800"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default MessageForm