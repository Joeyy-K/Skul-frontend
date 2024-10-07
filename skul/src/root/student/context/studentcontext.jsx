import React, { createContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null);

  const setStudentData = useCallback((data) => {
    setStudent(data);
  }, []);

  useEffect(() => {
    const studentCookie = Cookies.get('student');
    const student = studentCookie ? JSON.parse(studentCookie) : null;

    setStudentData(student);
  }, [setStudentData]);

  return (
    <StudentContext.Provider value={{ student, setStudent: setStudentData }}>
      {children}
    </StudentContext.Provider>
  );
};
