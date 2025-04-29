import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    location: '',
    category: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/jobs');
        setJobs(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                          job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
                          job.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesType = filters.type === '' || job.type === filters.type;
    const matchesLocation = filters.location === '' || job.location.includes(filters.location);
    const matchesCategory = filters.category === '' || job.category === filters.category;
    
    return matchesSearch && matchesType && matchesLocation && matchesCategory;
  });

  // Get unique locations and categories for filter options
  const locations = [...new Set(jobs.map(job => job.location))];
  const categories = [...new Set(jobs.map(job => job.category))];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Job Listings</h1>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-gray-700 mb-2">Search</label>
            <input
              type="text"
              id="search"
              name="search"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Job title, company, or keyword"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-gray-700 mb-2">Job Type</label>
            <select
              id="type"
              name="type"
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-gray-700 mb-2">Location</label>
            <select
              id="location"
              name="location"
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.location}
              onChange={handleFilterChange}
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-gray-700 mb-2">Category</label>
            <select
              id="category"
              name="category"
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Job Listings */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-yellow-100 p-6 rounded-lg text-center">
            <p className="text-yellow-700">No jobs match your filters. Try adjusting your search criteria.</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))
        )}
      </div>
    </div>
  );
};

const JobCard = ({ job }) => {
  // Format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2">{job.title}</h2>
          <p className="text-gray-600 mb-2">{job.company}</p>
          <div className="flex items-center text-gray-500 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>{job.location}</span>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm mb-2">{job.type}</span>
          {job.salary && <p className="text-gray-700 mb-2">Salary: {job.salary}</p>}
          <p className="text-gray-500 text-sm">Posted: {formatDate(job.createdAt)}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-gray-700 line-clamp-3">{job.description.substring(0, 200)}...</p>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills.slice(0, 4).map((skill, index) => (
          <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">{skill}</span>
        ))}
        {job.skills.length > 4 && (
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">+{job.skills.length - 4} more</span>
        )}
      </div>
      
      <div className="mt-6">
        <Link 
          to={`/jobs/${job._id}`} 
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 inline-block border border-yellow-500"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobList; 