import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const TeacherContext = createContext();

export const TeacherProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const teacherCookie = Cookies.get('teacher');
    const teacher = teacherCookie ? JSON.parse(teacherCookie) : null;

    setTeacher(teacher);
  }, []);

  return (
    <TeacherContext.Provider value={{ teacher, setTeacher }}>
      {children}
    </TeacherContext.Provider>
  );
};
