import React, { useContext, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const RootLayout = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/'); 
    }
  }, [isAuthenticated, navigate]);


  if (isLoading) {

    return (
      <div className="flex justify-center items-center h-screen">
        <div className="rounded-full h-20 w-20 bg-violet-800 dark:bg-gray-500 animate-pingm"></div>
      </div>
  )
  }

  return (
    <div>
      <section>
        <Outlet />
      </section>
    </div>
  )
}

export default RootLayout;
