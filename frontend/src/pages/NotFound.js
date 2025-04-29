import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-8">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
      <p className="text-xl text-gray-600 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 border border-yellow-500">
        Go to Home Page
      </Link>
    </div>
  );
};

export default NotFound; 