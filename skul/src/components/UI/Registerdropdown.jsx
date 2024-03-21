import React from 'react'

function Registerdropdown({ role, setUserRole }) {
  return (
    <div>
        <label className="block mb-2 text-base font-bold text-gray-700 dark:text-white">Role:</label>
            <div className="group relative cursor-pointer py-2 mb-3">
                <div className="flex items-center bg-white">
                    <button type="button" className="menu-hover my-2 py-2 text-base font-medium text-black mx-4" onClick={(e) => {e.preventDefault(); setRole('')}}>
                        {role || "Select a role"}
                    </button>
                    <span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                        stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                    </span>
                </div>
                <div
                    className="invisible absolute z-50 flex flex-col bg-gray-100 py-1 px-4 text-gray-800 shadow-xl group-hover:visible">
                    <button type="button" className="my-2 block border-b border-gray-100 py-1 font-semibold text-gray-500 hover:text-black md:mx-2" onClick={(e) => {e.preventDefault(); setUserRole('')}}>
                        Select a role
                    </button>
                    <button type="button" className="my-2 block border-b border-gray-100 py-1 font-semibold text-gray-500 hover:text-black md:mx-2" onClick={(e) => {e.preventDefault(); setUserRole('school')}}>
                        School
                    </button>
                    <button type="button" className="my-2 block border-b border-gray-100 py-1 font-semibold text-gray-500 hover:text-black md:mx-2" onClick={(e) => {e.preventDefault(); setUserRole('teacher')}}>
                        Teacher
                    </button>
                    <button type="button" className="my-2 block border-b border-gray-100 py-1 font-semibold text-gray-500 hover:text-black md:mx-2" onClick={(e) => {e.preventDefault(); setUserRole('student')}}>
                        Student
                    </button>
                </div>
            </div>
        </div>
  )
}

export default Registerdropdown