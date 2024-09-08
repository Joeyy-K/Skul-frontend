import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { AuthContext } from '../../../contexts/AuthContext'
import { logout } from '../../../components/cookie/logout';
import Avatar from '../../../components/shared/Avatars';

function Header({ handleSidebar }) {
    const { user } = useContext(UserContext);
    const { setUser } = useContext(UserContext)
    const [theme, setTheme] = useState('light');
    const { setIsAuthenticated } = useContext(AuthContext)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    async function handleLogout() {
      const response = await logout();
      if (response && response.ok) {
        setIsAuthenticated(false);
        console.log('Logout successful');
        setUser(null);
      } else {
        console.error('Logout failed');
      }
    } 

    useEffect(() => {
      const storedTheme = localStorage.getItem('theme');
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const initialTheme = storedTheme || systemPreference;
      setTheme(initialTheme);
    }, []);

    const handleThemeSwitch = () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [theme]);

    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const sun = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
    );

    const moon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
        />
      </svg>
    );

    

    return (
      <div className="bg-white dark:bg-black shadow w-screen border-b border-gray-500 dark:border-gray-700">
        <div className="mx-auto">
          <div className="flex justify-between items-center py-4 px-4">
            <h1 className="text-xl font-semibold text-black dark:text-white">Skul</h1>
            <div className="flex items-center">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="border border-gray-500 dark:border-gray-300 px-3 py-1 mr-4 focus:btn-outline dark:text-white normal-case text-black ml-2"
                >
                  <span>Profile</span>
                  <svg width="12px" height="12px" className="h-2 w-2 ml-1 fill-current opacity-60 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="z-[1] p-2 shadow bg-gray-200 dark:bg-gray-900 rounded-box w-80 absolute top-full right-0 mt-2">
                    <div className="rounded-lg bg-base-300 p-3 drop-shadow-xl divide-y divide-neutral">
                      <div className="flex space-x-4 items-center p-4">
                        <div className="flex mr-auto items-center space-x-4">
                        <Avatar 
                          avatarUrl={user.user?.avatar_url} 
                          name={`${user.full_name}`} 
                          size={32} 
                        />
                          <div className="space-y-2 flex flex-col flex-1 truncate">
                            <div className="relative leading-tight ">
                              <span className="flex">
                                <span className="truncate relative pr-8 text-gray-900 dark:text-white">Profile:</span>
                              </span>
                            </div>
                            <p className="font-normal text-base leading-tight truncate text-gray-900 dark:text-white">{user.user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div aria-label="navigation" className="py-2">
                        <nav className="grid gap-1">
                          <a href="/school-dashboard/profile" className="flex items-center leading-6 space-x-3 py-3 px-4 w-full text-lg text-gray-900 dark:text-gray-200 dark:hover:text-gray-700 focus:outline-none hover:bg-gray-100 rounded-md">
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                              <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                                <g transform="translate(-140.000000, -2159.000000)" fill="currentColor">
                                  <g transform="translate(56.000000, 160.000000)">
                                    <path d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598" id="profile_round-[#1342]">
                                    </path>
                                  </g>
                                </g>
                              </g>
                            </svg>
                            <span>View Profile</span>
                          </a>
                        </nav>
                      </div>
                      <div className="pt-2">
                        <button onClick={handleLogout} className="flex items-center space-x-3 py-3 px-4 w-full leading-6 text-lg text-gray-900 dark:text-gray-200 dark:hover:text-gray-700 focus:outline-none hover:bg-gray-100 rounded-md">
                          <svg className="w-7 h-7" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                            <path d="M9 12h12l-3 -3" />
                            <path d="M18 15l3 -3" />
                          </svg>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                    </div>
                    )}
              </div>
                <button
                  type="button"
                  onClick={handleThemeSwitch}
                  className="bg-indigo-500 dark:bg-orange-300 text-lg px-3 py-1 rounded-md mr-4"
                >
                {theme === 'dark' ? sun : moon}
                </button>
                <button
                  onClick={handleSidebar}
                  className="text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-white border border-gray-500 dark:border-gray-300 px-3 py-1"
                  id="open-sidebar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Header;
