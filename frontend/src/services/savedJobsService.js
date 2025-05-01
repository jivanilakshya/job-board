import axios from 'axios';

const API_URL = '/api/users';

// Save a job
const saveJob = async (jobId) => {
  const response = await axios.post(`${API_URL}/saved-jobs/${jobId}`);
  return response.data;
};

// Get saved jobs
const getSavedJobs = async () => {
  const response = await axios.get(`${API_URL}/saved-jobs`);
  return response.data;
};

// Remove a saved job
const removeSavedJob = async (jobId) => {
  const response = await axios.delete(`${API_URL}/saved-jobs/${jobId}`);
  return response.data;
};

const savedJobsService = {
  saveJob,
  getSavedJobs,
  removeSavedJob
};

export default savedJobsService; 