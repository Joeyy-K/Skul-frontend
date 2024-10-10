import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Darkmode from '../../components/ui/Darkmode';
import { AuthContext } from '../../contexts/AuthContext';
import { UserContext } from '../../contexts/UserContext';
import { getCookie } from '../../components/cookie/utils';
import Cookies from 'js-cookie';
import { API_URL } from '../../components/url/url';
import { Loader2 } from 'lucide-react'; 

const SignIn = () => {
  const { setIsAuthenticated, setRole } = useContext(AuthContext);
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  let csrftoken = getCookie('csrftoken');

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(''); 
  
    const data = {
      username: username,
      password: password,
    };
  
    fetch(`${API_URL}/schoolauth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify(data),
      credentials: 'include', 
    })
    .then((response) => {
      if (!response.ok) {
          return response.json().then(err => { throw new Error(err.error); });
        }
        return response.json();
    })
    .then(data => {
      setIsAuthenticated(true);
      setRole(data.role);
      setUser(data.user);
      Cookies.set('isAuthenticated', 'true');
      Cookies.set('role', data.role);
      Cookies.set('user', JSON.stringify(data.user));
      Cookies.set('userToken', data.token);
      if (data.role === 'teacher') {
        Cookies.set('teacher', JSON.stringify(data.user));
      } else if (data.role === 'student') {
        Cookies.set('student', JSON.stringify(data.user));
      } else if (data.role === 'school') {
        Cookies.set('school', JSON.stringify(data.user));
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      setError(error.message);
    })
    .finally(() => {
      setIsLoading(false); 
    });
  };
  
  return (
    <div className="h-full">
      <div className="flex justify-center pt-2">
        <Darkmode />
      </div>
      <div className="mx-auto">
        <div className="flex py-20">
          <div className="w-full justify-center flex">
            <div className="w-full lg:w-3/4 bg-gray-200 dark:bg-gray-700  rounded-lg">
                <h2 className="py-4 text-2xl text-center text-gray-800 dark:text-white">Welcome Back!</h2>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                <form className="px-8 pt-6 pb-8 mb-4 bg-gray-200 dark:bg-gray-800 rounded" onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <div className="mb-4">
                      <label className="block mb-2 text-base font-bold text-gray-700 dark:text-white">
                        Username:
                      </label>
                      <input 
                        className="w-full mb-3 py-2 text-base leading-tight text-gray-700 dark:text-black border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        type="text" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                      />
                      <label className="block mb-2 text-base font-bold text-gray-700 dark:text-white">
                        Password:       
                      </label>
                      <input 
                        className="w-full mb-3 py-2 text-base leading-tight text-gray-700 dark:text-black border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                      />
                      <div className="items-center justify-between mt-2">
                        <button 
                          className="flex mb-3 items-center justify-center px-8 py-3 border border-transparent text-base font-medium text-white bg-blue-500 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 md:py-4 md:text-lg md:px-10"
                          onClick={handleSubmit}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing In...
                            </>
                          ) : (
                            'Sign In'
                          )}
                        </button>
                        <p className="font-semibold text-black dark:text-white">
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