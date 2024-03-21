import React, { useState, useEffect, useContext } from 'react';
import Registerdropdown from '../../components/UI/Registerdropdown';
import Steptwo from '../../components/UI/Steptwo';
import Stepthree from '../../components/UI/Stepthree';
import Tstepthree from '../../components/UI/Tstepthree';
import Stepfour from '../../components/UI/Stepfour';
import { Link } from "react-router-dom";
import { AuthContext } from '../../contexts/AuthContext';
import Cookies from 'js-cookie';
import { getCookie } from '../../components/cookie/utils';

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

  let csrftoken = getCookie('csrftoken');

  useEffect(() => {
    setTotalSteps(role === 'school' ? 3 : 4);
  }, [role]);

  const handleNext = () => {
    event.preventDefault();
    if (step < totalSteps) {
      if (step === 1 && role) {
        setStep(step + 1);
      } else if (step === 2 && email && password) {
        setStep(step + 1);
      } else if (step === 3 && ((role === 'school' && fullName && location) || (role !== 'school' && firstName && lastName))) {
        setStep(step + 1);
      }
    } else {
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
      email,
      password,
      user: {
        username: username,
        email: email,
        password,
      },
    };
    console.log(data)

    if (role === 'school') {
      data.full_name = fullName;
      data.location = location;
    } else {
      data.first_name = firstName;
      data.last_name = lastName;
      data.school = schoolId;
    }

    fetch('http://127.0.0.1:8000/schoolauth/register/', {
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
		    <div className="flex py-5">
          <div className="w-full justify-center flex">
            <div className="w-full lg:w-3/4 bg-gray-200 dark:bg-gray-700 p-5 rounded-lg">
					    <h3 className="py-4 text-2xl text-center text-gray-800 dark:text-white">Create an Account!</h3>
              <form className="px-8 pt-6 pb-8 mb-4 bg-gray-200 dark:bg-gray-800 rounded">
              <div className="flex justify-between px-2 mb-4">
              <div className={step === 1 ? "text-pink-500" : "text-gray-500"}>Step 1</div>
              <div className={step === 2 ? "text-pink-500" : "text-gray-500"}>Step 2</div>
              <div className={step === 3 ? "text-pink-500" : "text-gray-500"}>Step 3</div>
              {role !== 'school' && <div className={step === 4 ? "text-pink-500" : "text-gray-500"}>Step 4</div>}
              </div>
              <div className="relative h-5 rounded-full overflow-hidden bg-gray-300 mt-2 mb-5 mx-10">
                <div className="absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }} />
              </div>

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
                <p className="font-semibold">
                    Already Have An Account?
                    <Link className="text-red-600 underline" to={'/'}>
                      {} Sign In
                    </Link>
                </p>
                </div>
                <aside className="">
                  <div className="bg-gray-100 p-8 rounded">
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
