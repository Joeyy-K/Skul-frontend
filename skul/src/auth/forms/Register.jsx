import React, { useState, useEffect, useContext } from 'react';
import Registerdropdown from '../../components/ui/Registerdropdown';
import Steptwo from '../../components/ui/Steptwo';
import Stepthree from '../../components/ui/Stepthree';
import Tstepthree from '../../components/ui/Tstepthree';
import Stepfour from '../../components/ui/Stepfour';
import { Link } from "react-router-dom";
import { AuthContext } from '../../contexts/AuthContext';
import { UserContext } from '../../contexts/UserContext';
import Darkmode from '../../components/ui/Darkmode';
import Cookies from 'js-cookie';
import { getCookie } from '../../components/cookie/utils';
import { API_URL } from '../../components/url/url';

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setUserRole] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [totalSteps, setTotalSteps] = useState(4);
  const { setIsAuthenticated, setRole } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const [error, setError] = useState('');

  let csrftoken = getCookie('csrftoken');

  useEffect(() => {
    setTotalSteps(role === 'school' ? 3 : 4);
  }, [role]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return nameRegex.test(name);
  };

  const handleNext = () => {
    event.preventDefault();
    if (step < totalSteps) {
      if (step === 1 && role) {
        setError('');
        setStep(step + 1);
      } else if (step === 2 && email && password.length >= 8 && isValidEmail(email) && username) {
        setError('');
        setStep(step + 1);
      } else if (step === 3 && ((role === 'school' && fullName && isValidName(fullName) && location) || (role !== 'school' && firstName && isValidName(firstName) && lastName && isValidName(lastName)))) {
        setError('');
        setStep(step + 1);
      } else {
        let errorMessage = '';
        if (!role) {
          errorMessage = 'Please select a role';
        } else if (!isValidEmail(email)) {
          errorMessage = 'Please enter a valid email address';
        } else if (password.length < 8) {
          errorMessage = 'Password must be at least 8 characters long';
        } else if (!username) {
          errorMessage = 'Please enter a username';
        } else if (role === 'school' && (!fullName || !isValidName(fullName))) {
          errorMessage = 'Please enter a valid full name';
        } else if (role !== 'school' && (!firstName || !isValidName(firstName) || !lastName || !isValidName(lastName))) {
          errorMessage = 'Please enter valid first and last names';
        }
        setError(errorMessage);
      }
    } else {
        setIsLoading(true);
        register();
    }
  };

  const handleBack = () => {
    event.preventDefault();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const register = () => {
    const data = {
      role,
      user: {
        username: username,
        email: email,
        password: password,
      },
    };
  
    if (role === 'school') {
      data.full_name = fullName;
      data.location = location;
    } else {
      data.first_name = firstName;
      data.last_name = lastName;
      data.school = schoolId;
    }
  
    fetch(`${API_URL}/schoolauth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
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
      .then((data) => {
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
		    <div className="flex py-5">
          <div className="w-full justify-center flex">
            <div className="w-full lg:w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg">
					    <h3 className="py-4 text-2xl text-center text-gray-800 dark:text-white">Create an Account!</h3>
              <form className="px-8 pt-6 pb-8 mb-4 bg-gray-200 dark:bg-gray-800 rounded">
              <div className="flex justify-between px-2 mb-4">
              <div className={step === 1 ? "text-pink-500" : "text-gray-500 dark:text-gray-100"}>Step 1</div>
              <div className={step === 2 ? "text-pink-500" : "text-gray-500 dark:text-gray-100"}>Step 2</div>
              <div className={step === 3 ? "text-pink-500" : "text-gray-500 dark:text-gray-100"}>Step 3</div>
              {role !== 'school' && <div className={step === 4 ? "text-pink-500 dark:text-gray-100" : "text-gray-500 dark:text-gray-100"}>Step 4</div>}
              </div>
              <div className="relative h-5 rounded-full overflow-hidden bg-gray-300 mt-2 mb-5 mx-10">
                <div className="absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }} />
              </div>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

                <div>
                {step === 1 && (
                  <Registerdropdown role={role} setUserRole={setUserRole} />
                )}
                {step === 2 && (
                  <Steptwo email={email} password={password} username={username} setEmail={setEmail} setPassword={setPassword} setUsername={setUsername}/>
                )}
                {step === 3 && role === 'school' && (
                  <Stepthree fullName={fullName} location={location} setFullName={setFullName} setLocation={setLocation}/>
                )}

                {step === 3 && role !== 'school' && (
                  <Tstepthree firstName={firstName} lastName={lastName} setFirstName={setFirstName} setLastName={setLastName} />
                )}

                {step === 4 && role !== 'school' && (
                   <Stepfour schoolId={schoolId} setSchoolId={setSchoolId} />
                )}
                <div className="flex justify-between">
                {step > 1 && (
                <div className="mb-6">
                  <button 
                  className="items-center justify-center px-8 py-3 border border-transparent text-base font-medium text-white bg-blue-500 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 md:py-4 md:text-lg md:px-10 focus:outline-none focus:shadow-outline" 
                  onClick={handleBack}>
                    Back
                  </button>
                </div>
                )}  
                <div className="mb-3">
                  <button 
                    className="items-center justify-center px-8 py-3 border border-transparent text-base font-medium text-white bg-blue-500 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 md:py-4 md:text-lg md:px-10 focus:outline-none focus:shadow-outline" 
                    onClick={handleNext}>
                    {step < totalSteps ? 'Next' : 'Register'}
                  </button>
                </div>      
                </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-black dark:text-white">
                    Already Have An Account?
                    <Link className="text-red-600 underline" to={'/'}>
                      {} Sign In
                    </Link>
                </p>
                </div>
                <aside className="">
                  <div className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white p-8 rounded">
                      <h2 className="font-bold text-2xl">Instructions</h2>
                      <ul className="list-disc mt-4 list-inside">
                          <li>All users must provide a valid email address and password to create an account.</li>
                          <li>Users must not use offensive, vulgar, or otherwise inappropriate language in their username or profile information</li>
                          <li>Users must not create multiple accounts for the same person.</li>
                      </ul>
                  </div>
                </aside>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
      );
    };

export default Register;
