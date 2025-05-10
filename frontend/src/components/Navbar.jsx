import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check if user is logged in and get their role
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-black-600">
            JobBoard
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="sm:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center space-x-7">
            <Link
              to="/jobs"
              className="text-gray-600 hover:text-blue-600 transition duration-300 text-lg font-semibold"
            >
              Jobs
            </Link>
            {isLoggedIn && userRole === 'employer' && (
              <Link
                to="/post-job"
                className="text-gray-600 hover:text-blue-600 transition duration-300 text-lg font-semibold"
              >
                Post Job
              </Link>
            )}
            
            {isLoggedIn ? (
              <>
                <Link
                  to={userRole === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'}
                  className="text-gray-600 hover:text-blue-600 transition duration-300 text-lg font-semibold"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden py-2">
            <div className="flex flex-col space-y-2">
              <Link
                to="/jobs"
                className="text-gray-600 hover:text-blue-600 transition duration-300 px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Jobs
              </Link>
              {isLoggedIn && userRole === 'employer' && (
                <Link
                  to="/post-job"
                  className="text-gray-600 hover:text-blue-600 transition duration-300 px-4 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Post Job
                </Link>
              )}
              <Link
                to="/employers"
                className="text-gray-600 hover:text-blue-600 transition duration-300 px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                For Employers
              </Link>
              <Link
                to="/candidates"
                className="text-gray-600 hover:text-blue-600 transition duration-300 px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                For Candidates
              </Link>
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-blue-600 transition duration-300 px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 mx-4"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 mx-4"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate('/register');
                      setIsMenuOpen(false);
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300 mx-4"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 