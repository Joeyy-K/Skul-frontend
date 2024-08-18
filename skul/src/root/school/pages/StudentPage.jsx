import React, { useState, useEffect, useContext } from 'react';
import CreateStudentProfile from '../forms/CreateStudentProfile';
import { useSchoolData } from '../context/useSchoolData';
import Cookies from 'js-cookie';
import GradeStudentList from '../components/GradeStudentList';

function StudentsPage() {
    const { school, loading } = useSchoolData();
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    let userToken = Cookies.get('userToken');

    useEffect(() => {
        if (school) {
            fetchStudents();
            fetchGrades();
        }
    }, [school, selectedGrade]);

    const fetchStudents = () => {
        let url = `http://127.0.0.1:8000/school/students/?school_id=${school.id}`;
        if (selectedGrade && selectedGrade.id !== 'all') {
            url += `&grade_id=${selectedGrade.id}`;
        }
        fetch(url, {
            headers: {
                'Authorization': `Token ${userToken}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setStudents(data);
                setCurrentPage(1);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const fetchGrades = () => {
        fetch(`http://127.0.0.1:8000/school/grades/?school_id=${school.id}`, {
            headers: {
                'Authorization': `Token ${userToken}`,
            },
        })
            .then(response => response.json())
            .then(data => setGrades(data))
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const handleGradeSelect = (grade) => {
        setSelectedGrade(grade);
        setCurrentPage(1);
    };

    const handleBackToGrades = () => {
        setSelectedGrade(null);
    };

    const handleAddStudent = (newStudent) => {
        setStudents([...students, newStudent]);
    };

    const handleStudentUpdate = () => {
        fetchStudents();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-800">
            <div className="flex flex-col mt-6 mb-6">
                <GradeStudentList
                    grades={grades}
                    students={students}
                    selectedGrade={selectedGrade}
                    onGradeSelect={handleGradeSelect}
                    onBackToGrades={handleBackToGrades}
                    onStudentUpdate={handleStudentUpdate}
                />
                <CreateStudentProfile onAddStudent={handleAddStudent} selectedGrade={selectedGrade} />
            </div>
        </div>
    );
}

export default StudentsPage;