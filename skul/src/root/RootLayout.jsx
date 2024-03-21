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
    <div>
      <section>
        <Outlet />
      </section>
    </div>
  )
}

export default RootLayout;