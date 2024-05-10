import React from 'react'; 

const GradeList = ({ grades, onGradeSelect }) => { 
  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-4">
      <h2 className="text-gray-700 dark:text-gray-100 mb-2">Grades</h2>
      {grades.map((grade) => (
        <div 
          key={grade.id}
          onClick={() => onGradeSelect(grade)} 
          className="cursor-pointer py-2 px-4 rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 mb-2 text-gray-800 dark:text-gray-200" 
        > 
          {grade.name}
        </div>
      ))}
    </div>
  ); 
}; 

export default GradeList; 