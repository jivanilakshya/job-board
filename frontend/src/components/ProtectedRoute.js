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
      return <Navigate to="/" replace />;
    }
  }

  // If authenticated and has required role (or no role is required), render children
  return children;
};

export default ProtectedRoute; 