import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavbarAndHeader from './components/NavbarAndHeader';
import HomePage from './pages/HomePage';
import StudentPage from './pages/StudentPage';
import GradesPage from './pages/GradesPage';
import SchedulePage from './pages/SchedulePage';
import ChannelPage from './pages/ChannelPage';
import FeedbackPage from './pages/FeedbackPage';
import MessagePage from './pages/MessagePage';
import AssignementPage from './pages/AssignementPage';

function TeacherLayout() {
  return (
    <div>
      <NavbarAndHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/students" element={<StudentPage />} />
          <Route path="/grades" element={<GradesPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/channel" element={<ChannelPage />} />
          <Route path="/assignements" element={<AssignementPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/messages/:channelId" element={<MessagePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default TeacherLayout;

