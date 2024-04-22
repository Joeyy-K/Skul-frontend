import React, { useState, useEffect, useContext } from 'react'
import { TeacherContext } from '../contexts/teachercontext'
import MessageForm from '../forms/MessageForm'
import AnnouncementForm from '../forms/AnnouncementForm'
import Cookies from 'js-cookie'

function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const { teacher } = useContext(TeacherContext)
  
  let userToken = Cookies.get('userToken');

  useEffect(() => {
    if (teacher && teacher.user && teacher.user.channel) {
      // Fetch messages
      fetch(`http://127.0.0.1:8000/school/messages/?channel=${teacher.user.channel}`)
        .then(response => response.json())
        .then(data => setMessages(data))

      // Fetch announcements
      fetch('http://127.0.0.1:8000/school/announcements/', {
        headers: {
          'Authorization': `Token ${userToken}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log('Announcements data:', data); 
        setAnnouncements(data);
      })
    }
  }, [teacher])

  if (!teacher || !teacher.user || !teacher.user.channel) {
    return (
      <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-md shadow-md">
        <p className="text-gray-800 dark:text-white">You are not in any channel.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Messages</h1>
      {messages.map((message, index) => (
        <div key={index} className="bg-gray-200 dark:bg-gray-700 p-4 rounded-md mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">{message.sender.username}:</h2>
          <p className="text-gray-800 dark:text-white">{message.content}</p>
        </div>
      ))}
      <MessageForm channelId={teacher.user.channel} />


      <h2 className="text-2xl font-bold mb-4 mt-8 text-gray-800 dark:text-white">Announcements</h2>
      {announcements.map((announcement, index) => (
      <div key={index} className="bg-gray-200 dark:bg-gray-700 p-4 rounded-md mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">{announcement.title}</h2>
        <p className="text-gray-800 dark:text-white">{announcement.content}</p>
        {announcement.attachment && (  
          <a href={announcement.attachment} target="_blank" rel="noopener noreferrer">View Attachment</a>
        )}
      </div>
      ))}
      <div className="">
        <AnnouncementForm />
      </div>
    </div>
  )
}

export default MessagesPage