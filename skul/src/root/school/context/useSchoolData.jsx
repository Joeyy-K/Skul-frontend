import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const useSchoolData = () => {
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolData = async () => {
      const schoolCookie = Cookies.get('school');
      const school = schoolCookie ? JSON.parse(schoolCookie) : null;

      setSchool(school);
      setLoading(false);
    };

    fetchSchoolData();
  }, []);

  return { school, loading };
};
