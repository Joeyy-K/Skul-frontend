import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { fetchCSRFToken } from './components/cookie/csrf';

const RegisterForm = lazy(() => import("./auth/forms/Register"));
const AuthLayout = lazy(() => import("./auth/AuthLayout"));
const RootLayout = lazy(() => import("./root/RootLayout"));
const SignIn = lazy(() => import("./auth/forms/SignIn"))
const SchoolDashboard = lazy(() => import("./root/schoolpages/SchoolDashboard"));
const StudentDashboard = lazy(() => import("./root/studentpages/StudentDashboard"));
const TeacherDashboard = lazy(() => import("./root/teacherpages/TeacherDashboard"));


export default function App() {
  useEffect(() => {
    fetchCSRFToken();
  }, []);

  return (
    <main className='flex h-screen'>
        <Suspense fallback={
          <div className="w-1/2 m-auto h-auto">
            <div className="flex items-center justify-center space-x-2 animate-bounce">
              <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
              <div className="w-8 h-8 bg-black rounded-full"></div>
            </div>
          </div>}>
        

        <Routes>
            {/* public routes */}
            <Route element={<AuthLayout />}>
              <Route path="/register" element={<RegisterForm />} />
              <Route index element={<SignIn />} />
            </Route>

             {/* private routes */}
             <Route element={<RootLayout />}>
             <Route path="/school-dashboard" element={<SchoolDashboard />} />
             <Route path="/student-dashboard" element={<StudentDashboard />} />
             <Route path="/teacher-dashboard" element={<TeacherDashboard />} />

             </Route>
        </Routes>
        </Suspense>
    </main>
  )
}
