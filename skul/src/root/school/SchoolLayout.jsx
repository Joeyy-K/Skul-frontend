import React from 'react'
import NavbarAndHeader from './components/NavbarAndHeader';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GradesPage from './pages/GradesPage';

function SchoolLayout() {
  return (
    <div>
      <NavbarAndHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/grades" element={<GradesPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default SchoolLayout
