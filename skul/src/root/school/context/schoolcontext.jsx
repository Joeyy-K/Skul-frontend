import React, { createContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

export const SchoolContext = createContext();

export const SchoolProvider = ({ children }) => {
  const [school, setSchool] = useState(null);

  const setSchoolData = useCallback((data) => {
    setSchool(data);
  }, []);

  useEffect(() => {
    const schoolCookie = Cookies.get('school');
    const school = schoolCookie ? JSON.parse(schoolCookie) : null;

    setSchoolData(school);
  }, [setSchoolData]);

  return (
    <SchoolContext.Provider value={{ school, setSchool: setSchoolData }}>
      {children}
    </SchoolContext.Provider>
  );
};
