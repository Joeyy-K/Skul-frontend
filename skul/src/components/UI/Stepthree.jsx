import React from 'react'

function Stepthree({ fullName, location, setFullName, setLocation }) {
  return (
    <div className="mb-4">
        <div className="mb-4">
            <label className="block mb-2 text-base font-bold text-gray-700 dark:text-white">Full Name:</label>
            <input 
                className="w-full mb-3 py-2 text-base leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text" 
                value={fullName} 
                onChange={e => setFullName(e.target.value)} 
            />

            <label className="block mb-2 text-base font-bold text-gray-700 dark:text-white">Location:</label>
            <input 
                className="w-full mb-3 py-2 text-base leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text" 
                value={location} 
                onChange={e => setLocation(e.target.value)} 
            />
        </div>
    </div>
  )
}

export default Stepthree