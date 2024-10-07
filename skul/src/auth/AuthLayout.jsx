import React, { useContext, useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const AuthLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, role } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      switch(role) {
        case 'school':
          navigate('/school-dashboard'); 
          break;
        case 'student':
          navigate('/student-dashboard');
          break;
        case 'teacher':
          navigate('/teacher-dashboard');
          break;
        default:
          console.log('Invalid role');
      }
    }
  }, [isAuthenticated, role]);

  const getHomePath = () => {
    switch(role) {
      case 'school':
        return '/school-dashboard';
      case 'student':
        return '/student-dashboard';
      case 'teacher':
        return '/teacher-dashboard';
    }
  };


  if (isLoading) {
    return (
      <div className="w-1/2 m-auto h-auto">
        <div className="flex items-center justify-center space-x-2 animate-bounce">
          <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
          <div className="w-8 h-8 bg-black rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      { isAuthenticated ? (
        <Navigate to={getHomePath()} />
      ) : (
        <>
          <section className="min-w-full">
            <Outlet />
          </section>
        </>
      )}
    </>
  )
}

export default AuthLayout;