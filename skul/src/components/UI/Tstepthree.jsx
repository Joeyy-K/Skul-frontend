import React from 'react'

function Tstepthree({ firstName, lastName, setFirstName, setLastName }) {
  return (
    <div className="mb-4">
        <div className="mb-4">
            <label className="block mb-2 text-base font-bold text-gray-700 dark:text-white">First Name:</label>
            <input 
                className="w-full mb-3 py-2 text-base leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text" 
                value={firstName} onChange={e => setFirstName(e.target.value)} 
            />

            <label className="block mb-2 text-base font-bold text-gray-700 dark:text-white">Last Name:</label>
            <input 
                className="w-full mb-3 py-2 text-base leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text" 
                value={lastName} onChange={e => setLastName(e.target.value)} 
            />
        </div>
    </div>
  )
}

export default Tstepthree