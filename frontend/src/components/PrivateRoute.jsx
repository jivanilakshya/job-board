import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow access to profile page for all authenticated users
  if (location.pathname === '/profile') {
    return children;
  }

  if (role && user?.role !== role) {
    // Redirect to appropriate dashboard if role doesn't match
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  return children;
};

export default PrivateRoute; 