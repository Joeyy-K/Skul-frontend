import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { getCookie } from '../../components/cookie/utils';
import Cookies from 'js-cookie';

const SignIn = () => {
  const { setIsAuthenticated, setRole } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  let csrftoken = getCookie('csrftoken');

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const data = {
      username: username,
      password: password,
    };
  
    fetch('http://127.0.0.1:8000/schoolauth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify(data),
      credentials: 'include', 
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      setIsAuthenticated(true);
      setRole(data.role);
      Cookies.set('isAuthenticated', 'true');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };
  

  return (
    <div className="h-full  bg-white dark:bg-gray-900">
      <div className="mx-auto">
		    <div className="flex py-20">
          <div className="w-full justify-center flex">
            <div className="w-full lg:w-3/4 bg-gray-200 dark:bg-gray-700 p-5 rounded-lg">
                <h2 className="py-4 text-2xl text-center text-gray-800 dark:text-white">Welcome Back!</h2>
                <form className="px-8 pt-6 pb-8 mb-4 bg-gray-200 dark:bg-gray-800 rounded" onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <div className="mb-4">
                      <label className="block mb-2 text-base font-bold text-gray-700 dark:text-white">
                        Username:
                      </label>
                      <input 
                        className="w-full mb-3 py-2 text-base leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        type="text" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                      />
                      <label className="block mb-2 text-base font-bold text-gray-700 dark:text-white">
                        Password:       
                      </label>
                      <input 
                        className="w-full mb-3 py-2 text-base leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                      />
                      <div className="items-center justify-between mt-2">
                        <button 
                          className="flex mb-3 items-center justify-center px-8 py-3 border border-transparent text-base font-medium text-white bg-blue-500 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 md:py-4 md:text-lg md:px-10"
                          onClick={handleSubmit}
                          >
                            Sign In
                        </button>
                        <p className="font-semibold">
                          Don't have an account?
                          <Link className="text-red-600 underline" to={'/register'}>
                            {} Register
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
