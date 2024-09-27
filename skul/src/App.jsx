import React, { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { fetchCSRFToken } from './components/cookie/csrf'
import AppWrapper from './components/shared/AppWrapper'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = lazy(() => import('./auth/forms/Register'))
const AuthLayout = lazy(() => import('./auth/AuthLayout'))
const RootLayout = lazy(() => import('./root/RootLayout'))
const SignIn = lazy(() => import('./auth/forms/SignIn'))
const SchoolLayout = lazy(() => import('./root/school/SchoolLayout'))
const StudentLayout = lazy(() => import('./root/student/StudentLayout'))
const TeacherLayout = lazy(() => import('./root/teacher/TeacherLayout'))

export default function App() {
  
  useEffect(() => {
    fetchCSRFToken();
  }, []);  

  return (
    <AppWrapper>
      
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="rounded-full h-20 w-20 bg-violet-800 dark:bg-gray-500 animate-ping"></div>
        </div>
      }><ToastContainer />
        <Routes>
          {/* public routes */}
          <Route element={<AuthLayout />}>
            <Route path="/register" element={<RegisterForm />} />
            <Route index element={<SignIn />} />
          </Route>
          {/* private routes */}
          <Route element={<RootLayout />}>
            <Route path="/school-dashboard/*" element={<SchoolLayout />} />
            <Route path="/student-dashboard/*" element={<StudentLayout />} />
            <Route path="/teacher-dashboard/*" element={<TeacherLayout />} />
          </Route>
        </Routes>
      </Suspense>
    </AppWrapper>
  )
}