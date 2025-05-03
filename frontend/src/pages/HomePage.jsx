import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs/featured');
        setFeaturedJobs(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured jobs:', error);
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">
              Find Your Dream Job Today
            </h1>
            <p className="text-lg sm:text-xl mb-8">
              Discover thousands of job opportunities with all the information you need.
            </p>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                className="flex-1 p-3 rounded-lg text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                className="flex-1 p-3 rounded-lg text-gray-900"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button
                type="submit"
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition duration-300"
              >
                Search Jobs
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Featured Jobs
          </h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
                >
                  <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-2">{job.company}</p>
                  <p className="text-gray-500 mb-4">{job.location}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      {job.type}
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {job.experience}
                    </span>
                    {job.salary && (
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        ${job.salary}
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="block text-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 text-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Your Perfect Job</h3>
              <p className="text-gray-600">
                Browse through thousands of job listings and find the one that matches your skills and interests.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 text-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Post Jobs</h3>
              <p className="text-gray-600">
                Employers can easily post job listings and find qualified candidates for their open positions.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 text-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Our platform ensures secure job applications and protects your personal information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 