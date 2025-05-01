import React, { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import savedJobsService from '../services/savedJobsService';

const SaveJobButton = ({ jobId }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const response = await savedJobsService.getSavedJobs();
        const savedJobIds = response.data.map(job => job._id);
        setIsSaved(savedJobIds.includes(jobId));
        setLoading(false);
      } catch (err) {
        console.error('Error checking saved status:', err);
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
    }
  };

  if (loading) {
    return <div className="animate-pulse h-6 w-6 bg-gray-200 rounded"></div>;
  }

  return (
    <button
      onClick={handleSaveJob}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
        isSaved ? 'text-blue-500' : 'text-gray-400'
      }`}
      title={isSaved ? 'Remove from saved jobs' : 'Save job'}
    >
      {isSaved ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
    </button>
  );
};

export default SaveJobButton; 