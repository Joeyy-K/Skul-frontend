import React from 'react'

function Steptwo({ email, password, username, setEmail, setPassword, setUsername }) {
  return (
    <div className="mb-4">
        <div className="mb-4">
            <label className="block mb-2 text-base font-bold text-gray-700 dark:text-white">Email:</label>
            <input
                className="w-full mb-3 py-2 text-base leading-tight text-gray-700 dark:text-black border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
            />

            <label className="block mb-2 text-base font-bold text-gray-700 dark:text-white">Username:</label>
            <input
                className="w-full mb-3 py-2 text-base leading-tight text-gray-700 dark:text-black border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
            />

            <label className="block mb-2 text-base font-bold text-gray-700 dark:text-white">Password:</label>
            <input
                className="w-full mb-3 py-2 text-base leading-tight text-gray-700 dark:text-black border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="password"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
            />
        </div>
    </div>
  )
}

export default Steptwo