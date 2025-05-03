import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    experience: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const search = params.get('search') || '';
        const response = await axios.get('http://localhost:5000/api/jobs', {
          params: { ...filters, search }
        });
        setJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [location.search, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (filters.location) params.append('location', filters.location);
    if (filters.jobType) params.append('jobType', filters.jobType);
    if (filters.experience) params.append('experience', filters.experience);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full p-3 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <select
                name="location"
                className="p-3 border rounded-lg w-full"
                value={filters.location}
                onChange={handleFilterChange}
              >
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <select
                name="jobType"
                className="p-3 border rounded-lg w-full"
                value={filters.jobType}
                onChange={handleFilterChange}
              >
                <option value="">All Job Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
              </select>
              <select
                name="experience"
                className="p-3 border rounded-lg w-full"
                value={filters.experience}
                onChange={handleFilterChange}
              >
                <option value="">All Experience Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Search Jobs
            </button>
          </form>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                    <p className="text-gray-600 mb-2">{job.company}</p>
                    <p className="text-gray-500 mb-2">{job.location}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {job.jobType}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {job.experience}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        ${job.salary}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-auto text-center"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/jobs/${job._id}/apply`}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300 w-full sm:w-auto text-center"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings; 