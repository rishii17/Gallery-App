import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaImages, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

const Navbar = () => {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  // Effect to close the dropdown if a click occurs outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false); // Close menu on logout
    navigate('/login');
  };

  const linkClasses = "px-3 py-2 rounded-md text-sm font-medium";
  const activeLinkClass = "bg-gray-900 text-white";
  const inactiveLinkClass = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <nav className="bg-gray-800 relative z-40">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-start">
            <Link to="/" className="text-white text-xl font-bold">MediaApp</Link>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                {isAuthenticated && (
                  <>
                    <NavLink to="/dashboard" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}><FaTachometerAlt className="inline mr-2"/>Dashboard</NavLink>
                    <NavLink to="/gallery" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}><FaImages className="inline mr-2"/>Gallery</NavLink>
                    <NavLink to="/contact" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}><FaEnvelope className="inline mr-2"/>Contact</NavLink>
                    {isAdmin && (
                       <NavLink to="/admin" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}><FaShieldAlt className="inline mr-2"/>Admin</NavLink>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="ml-3 relative"> {/* Removed 'group' class */}
                <button 
                  onClick={() => setIsProfileOpen(prev => !prev)} // Toggle state on click
                  className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span className="sr-only">Open user menu</span>
                  <FaUserCircle className="h-8 w-8 text-white" />
                </button>
                {/* Dropdown menu visibility is now controlled by `isProfileOpen` state */}
                <div
                  ref={profileMenuRef}
                  className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out
                    ${isProfileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                >
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">Signed in as <strong className="block truncate">{user?.name}</strong></div>
                  <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><FaSignOutAlt className="inline mr-2"/>Sign out</button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className={`${linkClasses} ${inactiveLinkClass}`}>Login</Link>
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
