import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  if (role && user?.role !== role) {
    // Redirect to appropriate dashboard if role doesn't match
    return <Navigate to={`/${user?.role}/dashboard`} />;
  }

  return children;
};

export default PrivateRoute; 