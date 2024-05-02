import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const SchoolContext = createContext();

export const SchoolProvider = ({ children }) => {
  const [school, setSchool] = useState(null);

  useEffect(() => {
    const schoolCookie = Cookies.get('school');
    const school = schoolCookie ? JSON.parse(schoolCookie) : null;

    setSchool(school);
  }, []);

  return (
    <SchoolContext.Provider value={{ school, setSchool }}>
      {children}
    </SchoolContext.Provider>
  );
};
