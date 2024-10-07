import React, { createContext, useState } from 'react';
import Cookies from 'js-cookie';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const userCookie = Cookies.get('user');
  const initialUser = userCookie ? JSON.parse(userCookie) : null;
  const [user, setUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};