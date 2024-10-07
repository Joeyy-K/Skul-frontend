import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const useTeacherData = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      const teacherCookie = Cookies.get('teacher');
      const teacher = teacherCookie ? JSON.parse(teacherCookie) : null;

      setTeacher(teacher);
      setLoading(false);
    };

    fetchTeacherData();
  }, []);

  return { teacher, loading };
};