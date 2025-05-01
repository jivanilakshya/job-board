import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, userRole, setIsAuthenticated, setUserRole }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    
    // Update state
    setIsAuthenticated(false);
    setUserRole(null);
    
    // Redirect to home page
    navigate('/');
  };

  return (
    <nav className="bg-black shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-yellow-500">
            JobBoard
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-yellow-500">
              Home
            </Link>
            <Link to="/jobs" className="text-white hover:text-yellow-500">
              Jobs
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-yellow-500">
                  Dashboard
                </Link>
                
                {userRole === 'employer' && (
                  <Link to="/post-job" className="text-white hover:text-yellow-500">
                    Post Job
                  </Link>
                )}

                <Link to="/saved-jobs" className="text-white hover:text-yellow-500">
                  Saved Jobs
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-yellow-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-yellow-500">
                  Login
                </Link>
                <Link to="/register" className="bg-yellow-600 text-black px-4 py-2 rounded hover:bg-yellow-500 font-semibold">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-yellow-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <Link
              to="/"
              className="block py-2 text-white hover:text-yellow-500"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="block py-2 text-white hover:text-yellow-500"
              onClick={toggleMenu}
            >
              Jobs
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 text-white hover:text-yellow-500"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                
                {userRole === 'employer' && (
                  <Link
                    to="/post-job"
                    className="block py-2 text-white hover:text-yellow-500"
                    onClick={toggleMenu}
                  >
                    Post Job
                  </Link>
                )}

                <Link
                  to="/saved-jobs"
                  className="block py-2 text-white hover:text-yellow-500"
                  onClick={toggleMenu}
                >
                  Saved Jobs
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left py-2 text-white hover:text-yellow-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-white hover:text-yellow-500"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-white hover:text-yellow-500"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 