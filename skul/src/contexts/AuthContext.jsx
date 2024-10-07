import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState('');

  useEffect(() => {
    const authCookie = Cookies.get('isAuthenticated');
    const roleCookie = Cookies.get('role');
    setIsAuthenticated(!!authCookie);
    setRole(roleCookie || '');
    setIsLoading(false);
  }, []);

  const handleSetRole = (newRole) => {
    setRole(newRole);
    Cookies.set('role', newRole);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading, role, setRole: handleSetRole }}>
      {children}
    </AuthContext.Provider>
  );
};
