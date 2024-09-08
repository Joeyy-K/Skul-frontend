import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { StudentProvider } from './root/student/context/studentcontext.jsx';
import { SchoolProvider } from './root/school/context/schoolcontext.jsx';
import { TeacherProvider } from './root/teacher/contexts/teachercontext.jsx';
import { UserProvider } from './contexts/UserContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <UserProvider>
        <SchoolProvider>
          <TeacherProvider>
            <StudentProvider>
              <App />
            </StudentProvider>
          </TeacherProvider>
        </SchoolProvider>
      </UserProvider>
    </AuthProvider>
  </BrowserRouter>
)
