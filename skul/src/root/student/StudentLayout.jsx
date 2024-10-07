import React from 'react'
import NavbarAndHeader from './components/NavbarAndHeader';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AssignmentPage from './pages/AssignmentPage';
import ChannelPage from './pages/ChannelPage';
import MessagePage from './pages/MessagePage';

function StudentLayout() {
  return (
    <div>
      <NavbarAndHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/assignments" element={<AssignmentPage />} />
          <Route path="/messages/:channelId" element={<MessagePage />} />
          <Route path="/channels" element={<ChannelPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default StudentLayout
