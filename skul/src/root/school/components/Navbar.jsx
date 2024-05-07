import { useContext, useEffect, useRef } from 'react'
import { UserContext } from '../../../contexts/UserContext'
import { AuthContext } from '../../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { logout } from '../../../components/cookie/logout'

function Navbar({ isOpen, setIsOpen }) {
    const { setUser } = useContext(UserContext)
    const { setIsAuthenticated } = useContext(AuthContext)
    const navbarRef = useRef(null)

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
          setIsOpen(false)
        }
      }

      document.addEventListener('click', handleClickOutside, true)
      return () => {
        document.removeEventListener('click', handleClickOutside, true)
      }
    }, [isOpen, setIsOpen])

    return (
      <div
        ref={navbarRef}
        className={`absolute bg-white dark:bg-black text-black dark:text-white w-56 min-h-screen overflow-y-auto transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ease-in-out duration-300`}
        id="sidebar"
      >
        <div className="p-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <ul className="mt-4">
            <li className="mb-2"><Link to="/school-dashboard/" className="block hover:text-indigo-400">Home</Link></li>
            <li className="mb-2"><Link to="/school-dashboard/students" className="block hover:text-indigo-400">Students</Link></li>
            <li className="mb-2"><Link to="/school-dashboard/teachers" className="block hover:text-indigo-400">Teachers</Link></li>
            <li className="mb-2"><Link to="/school-dashboard/grades" className="block hover:text-indigo-400">Grades</Link></li>
            <li className="mb-2"><Link to="/school-dashboard/channel" className="block hover:text-indigo-400">Channel</Link></li>
            <li className="mb-2"><button onClick={handleLogout} className="block hover:text-indigo-400">Logout</button></li>
          </ul>
        </div>
      </div>
    );
}

export default Navbar;
