import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const useStudentData = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      const studentCookie = Cookies.get('student');
      const student = studentCookie ? JSON.parse(studentCookie) : null;

      setStudent(student);
      setLoading(false);
    };

    fetchStudentData();
  }, []);

  return { student, loading };
};
