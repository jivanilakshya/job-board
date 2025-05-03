import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, requiredRole, children }) => {
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If requiredRole is specified, check user role
  if (requiredRole) {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== requiredRole && userRole !== 'admin') {
      // User doesn't have required role
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  // If authenticated and has required role (or no role is required), render children
  return children;
};

export default ProtectedRoute; 