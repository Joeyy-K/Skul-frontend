import React from 'react';
import GradeList from './GradeList';
import StudentList from './StudentList';

const GradeStudentList = ({ grades, students, selectedGrade, onGradeSelect, onBackToGrades, onStudentUpdate }) => {
    return (
        <div>
            {!selectedGrade ? (
                <GradeList grades={grades} onGradeSelect={onGradeSelect} />
            ) : (
                <StudentList
                    students={students}
                    selectedGrade={selectedGrade}
                    onBackToGrades={onBackToGrades}
                    onStudentUpdate={onStudentUpdate}
                />
            )}
        </div>
    );
};

export default GradeStudentList;