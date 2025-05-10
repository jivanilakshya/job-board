import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviews: 0,
    offers: 0,
    savedJobs: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const [applicationsResponse, profileResponse, savedJobsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/applications/candidate', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          axios.get('http://localhost:5000/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          axios.get('http://localhost:5000/api/jobs/saved', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);
        
        setApplications(applicationsResponse.data.data || []);
        setProfile(profileResponse.data.data);
        setSavedJobs(savedJobsResponse.data.data || []);
        
        // Calculate statistics
        const stats = {
          totalApplications: (applicationsResponse.data.data || []).length,
          interviews: (applicationsResponse.data.data || []).filter(app => app.status === 'interview').length,
          offers: (applicationsResponse.data.data || []).filter(app => app.status === 'offered').length,
          savedJobs: (savedJobsResponse.data.data || []).length
        };
        setStats(stats);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          window.location.href = '/login';
        } else {
          setError(error.response?.data?.message || 'Error loading dashboard data');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUnsaveJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}/save`);
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
      setStats(prev => ({
        ...prev,
        savedJobs: prev.savedJobs - 1
      }));
    } catch (error) {
      console.error('Error unsaving job:', error);
      setError(error.response?.data?.message || 'Error unsaving job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Candidate Dashboard</h1>
          <div className="flex gap-2">
            <Link
              to="/profile/edit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-auto text-center"
            >
              Edit Profile
            </Link>
            <Link
              to="/jobs"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 w-full sm:w-auto text-center"
            >
              Find Jobs
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Applications</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.totalApplications}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-gray-500 text-sm font-medium">Interviews</h3>
            <p className="text-2xl font-bold text-green-600">{stats.interviews}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-gray-500 text-sm font-medium">Offers</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.offers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-gray-500 text-sm font-medium">Saved Jobs</h3>
            <p className="text-2xl font-bold text-orange-600">{stats.savedJobs}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col sm:flex-row border-b">
            <button
              className={`px-4 py-2 sm:px-6 sm:py-3 text-left ${
                activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 sm:px-6 sm:py-3 text-left ${
                activeTab === 'applications' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('applications')}
            >
              My Applications
            </button>
            <button
              className={`px-4 py-2 sm:px-6 sm:py-3 text-left ${
                activeTab === 'saved' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('saved')}
            >
              Saved Jobs
            </button>
            <button
              className={`px-4 py-2 sm:px-6 sm:py-3 text-left ${
                activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              My Profile
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Applications */}
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
                  <div className="space-y-4">
                    {applications.slice(0, 3).map(application => (
                      <div key={application._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <h4 className="font-medium">{application.job.title}</h4>
                        <p className="text-sm text-gray-600">{application.job.company}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            application.status === 'interview' ? 'bg-green-100 text-green-800' :
                            application.status === 'offered' ? 'bg-purple-100 text-purple-800' :
                            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {application.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {applications.length > 3 && (
                    <Link
                      to="/applications"
                      className="text-blue-600 hover:underline text-sm mt-4 inline-block"
                    >
                      View all applications →
                    </Link>
                  )}
                </div>

                {/* Profile Completion */}
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Profile Completion</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Basic Information</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Resume</span>
                      <span className={profile.resume ? 'text-green-600' : 'text-red-600'}>
                        {profile.resume ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Skills</span>
                      <span className={profile.skills?.length > 0 ? 'text-green-600' : 'text-red-600'}>
                        {profile.skills?.length > 0 ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Experience</span>
                      <span className={profile.experience?.length > 0 ? 'text-green-600' : 'text-red-600'}>
                        {profile.experience?.length > 0 ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/profile/edit"
                    className="text-blue-600 hover:underline text-sm mt-4 inline-block"
                  >
                    Complete your profile →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4">
                {applications.map(application => (
                  <div key={application._id} className="bg-white border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{application.job.title}</h3>
                        <p className="text-gray-600 mb-2">{application.job.company}</p>
                        <p className="text-gray-500 mb-2">{application.job.location}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            application.status === 'interview' ? 'bg-green-100 text-green-800' :
                            application.status === 'offered' ? 'bg-purple-100 text-purple-800' :
                            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {application.status}
                          </span>
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                            {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Link
                          to={`/jobs/${application.job._id}`}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300 w-full sm:w-auto text-center"
                        >
                          View Job
                        </Link>
                        <Link
                          to={`/applications/${application._id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-auto text-center"
                        >
                          View Application
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="p-4">
              {savedJobs.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No saved jobs</h3>
                  <p className="text-gray-500 mb-4">Jobs you save will appear here</p>
                  <Link
                    to="/jobs"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 inline-block"
                  >
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {savedJobs.map(job => (
                    <div key={job._id} className="bg-white border rounded-lg p-4">
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
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 w-full sm:w-auto text-center"
                          >
                            Apply Now
                          </Link>
                          <button
                            onClick={() => handleUnsaveJob(job._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 w-full sm:w-auto text-center"
                          >
                            Unsave
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && profile && (
            <div className="p-4">
              <div className="bg-white border rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <p className="text-gray-600">
                        <span className="font-medium">Name:</span> {profile.name}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span> {profile.email}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Phone:</span> {profile.phone || 'Not provided'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Location:</span> {profile.location || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                    <div className="space-y-3">
                      <p className="text-gray-600">
                        <span className="font-medium">Title:</span> {profile.title || 'Not provided'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Experience:</span> {profile.experience || 'Not provided'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Education:</span> {profile.education || 'Not provided'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Skills:</span> {profile.skills?.join(', ') || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
                {profile.resume && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4">Resume</h3>
                    <a
                      href={profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard; 