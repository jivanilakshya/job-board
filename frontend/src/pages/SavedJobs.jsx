import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import savedJobsService from '../services/savedJobsService';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await savedJobsService.getSavedJobs();
        setSavedJobs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch saved jobs');
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleRemoveJob = async (jobId) => {
    try {
      await savedJobsService.removeSavedJob(jobId);
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
    } catch (err) {
      setError('Failed to remove job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">Saved Jobs</h1>
        
        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">You haven't saved any jobs yet.</p>
            <Link
              to="/jobs"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                    <p className="text-gray-600 mb-2">{job.company}</p>
                    <p className="text-gray-500 mb-2">{job.location}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {job.type}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {job.experience}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleRemoveJob(job._id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition duration-300"
                      title="Remove from saved jobs"
                    >
                      <FaTrash />
                    </button>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition duration-300"
                      title="View job details"
                    >
                      <FaExternalLinkAlt />
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

export default SavedJobs; 