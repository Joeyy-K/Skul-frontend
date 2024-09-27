import React from 'react'
import NavbarAndHeader from './components/NavbarAndHeader';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AssignmentPage from './pages/AssignmentPage';

function StudentLayout() {
  return (
    <div>
      <NavbarAndHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/assignment" element={<AssignmentPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default StudentLayout
