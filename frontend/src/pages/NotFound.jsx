import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl sm:text-8xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Go to Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 