import React, { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import savedJobsService from '../services/savedJobsService';

const SaveJobButton = ({ jobId }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const response = await savedJobsService.getSavedJobs();
        const savedJobIds = response.data.map(job => job._id);
        setIsSaved(savedJobIds.includes(jobId));
        setLoading(false);
      } catch (err) {
        console.error('Error checking saved status:', err);
        setError('Failed to check saved status');
        setLoading(false);
      }
    };

    checkIfSaved();
  }, [jobId]);

  const handleSaveJob = async () => {
    try {
      if (isSaved) {
        await savedJobsService.removeSavedJob(jobId);
      } else {
        await savedJobsService.saveJob(jobId);
      }
      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Error saving/removing job:', err);
      setError('Failed to update saved status');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse h-8 w-8 bg-gray-200 rounded-full"></div>
    );
  }

  if (error) {
    return (
      <button
        onClick={handleSaveJob}
        className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition duration-300"
        title="Error occurred. Click to retry"
      >
        <FaRegBookmark size={20} />
      </button>
    );
  }

  return (
    <button
      onClick={handleSaveJob}
      className={`p-2 rounded-full hover:bg-gray-100 transition duration-300 ${
        isSaved ? 'text-blue-500' : 'text-gray-400'
      }`}
      title={isSaved ? 'Remove from saved jobs' : 'Save job'}
    >
      {isSaved ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
    </button>
  );
};

export default SaveJobButton; 