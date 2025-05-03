import axios from 'axios';

const API_URL = '/api/users';

// Save a job
const saveJob = async (jobId) => {
  try {
    const response = await axios.post(`${API_URL}/saved-jobs/${jobId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save job');
  }
};

// Get saved jobs
const getSavedJobs = async () => {
  try {
    const response = await axios.get(`${API_URL}/saved-jobs`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch saved jobs');
  }
};

// Remove a saved job
const removeSavedJob = async (jobId) => {
  try {
    const response = await axios.delete(`${API_URL}/saved-jobs/${jobId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove saved job');
  }
};

const savedJobsService = {
  saveJob,
  getSavedJobs,
  removeSavedJob
};

export default savedJobsService; 