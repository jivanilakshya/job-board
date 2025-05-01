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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Saved Jobs</h1>
      
      {savedJobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">You haven't saved any jobs yet.</p>
          <Link to="/jobs" className="text-blue-500 hover:underline mt-4 inline-block">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <div key={job._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                  <p className="text-gray-600 mb-2">{job.company}</p>
                  <p className="text-gray-500 mb-2">{job.location}</p>
                </div>
                <button
                  onClick={() => handleRemoveJob(job._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
              
              <div className="mt-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                  {job.type}
                </span>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {job.experience}
                </span>
              </div>
              
              <div className="mt-4">
                <Link
                  to={`/jobs/${job._id}`}
                  className="text-blue-500 hover:text-blue-700 flex items-center"
                >
                  View Details <FaExternalLinkAlt className="ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs; 