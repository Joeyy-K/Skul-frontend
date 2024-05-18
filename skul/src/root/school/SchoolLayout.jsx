import React from 'react'
import NavbarAndHeader from './components/NavbarAndHeader';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GradesPage from './pages/GradesPage';
import StudentPage from './pages/StudentPage';
import TeacherPage from './pages/TeacherPage';
import ChannelPage from './pages/ChannelPage';
import MessagePage from './pages/MessagePage';

function SchoolLayout() {
  return (
    <div>
      <NavbarAndHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/grades" element={<GradesPage />} />
          <Route path="/students" element={<StudentPage />} />
          <Route path="/teachers" element={<TeacherPage />} />
          <Route path="/channel/" element={<ChannelPage />} />
          <Route path="/messages/:channelId" element={<MessagePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default SchoolLayout
