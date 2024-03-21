import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(''); 

  useEffect(() => {
    const authCookie = Cookies.get('isAuthenticated'); 
    setIsAuthenticated(!!authCookie);
    setIsLoading(false); 
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
