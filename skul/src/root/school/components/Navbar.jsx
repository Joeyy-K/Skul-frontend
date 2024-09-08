import { useContext, useEffect, useRef } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import { AuthContext } from '../../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../../components/cookie/logout';

function Navbar({ isOpen, setIsOpen }) {
  const { setUser } = useContext(UserContext);
  const { setIsAuthenticated } = useContext(AuthContext);
  const navbarRef = useRef(null);
  const location = useLocation();

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
    const handleClickOutside = (event) => {
      if (isOpen && !navbarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [isOpen, setIsOpen]);

  const navItems = [
    { path: '/school-dashboard/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/school-dashboard/students', label: 'Students', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { path: '/school-dashboard/teachers', label: 'Teachers', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
    { path: '/school-dashboard/grades', label: 'Grades', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { path: '/school-dashboard/channel', label: 'Channels', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
  ];

  return (
    <div
      ref={navbarRef}
      className={`fixed top-0 left-0 bg-white dark:bg-gray-800 text-gray-800 dark:text-white w-64 h-full overflow-y-auto transition-transform transform border-r border-gray-200 dark:border-gray-700 z-20 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ease-in-out duration-300`}
      id="sidebar"
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-lg transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    location.pathname === item.path ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="absolute bottom-0 w-full p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors duration-150"
        >
          <svg
            className="w-6 h-6 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;