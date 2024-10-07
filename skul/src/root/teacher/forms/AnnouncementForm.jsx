import React, { useState  } from 'react'
import { useTeacherData } from '../contexts/useTeacherData'
import Cookies from 'js-cookie'

const AnnouncementForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedFile, setSelectedFile] = useState(null);
  const { teacher, loading } = useTeacherData();
  let userToken = Cookies.get('userToken');

  const handleFileChange = (event) => { 
    setSelectedFile(event.target.files[0])
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData();
    formData.append('sender', teacher.id);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('school', teacher.school);
    if (selectedFile) { 
      formData.append('attachment', selectedFile);
    }

    fetch('http://127.0.0.1:8000/school/announcements/', {
      headers: {
        'Authorization': `Token ${userToken}`,
      },
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data)
      setTitle('')
      setContent('')
      setSelectedFile(null) 
    })
    .catch((error) => {
      console.error('Error:', error)
    })
  }

  if (loading) {
    return (
      <div>loading...</div>
    );
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Post an Announcement
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="shadow appearance-none border rounded-l-md w-full py-2 px-3 text-gray-800 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
          placeholder="Announcement Title"
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className="shadow appearance-none border rounded-l-md w-full py-2 px-3 text-gray-800 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Announcement Content"
        />
        <input 
          type="file"
          onChange={handleFileChange}
          className="shadow appearance-none border rounded-l-md w-full py-2 px-3 text-gray-800 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
        />
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none focus:shadow-outline dark:bg-indigo-700 dark:hover:bg-indigo-800 mt-4"
        >
          Post
        </button>
      </form>
    </div>
  )
}

export default AnnouncementForm
