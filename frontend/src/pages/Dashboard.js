import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState(userRole === 'employer' ? 'postedJobs' : 'applications');
  const [applications, setApplications] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Different data fetching based on user role
        if (userRole === 'employer') {
          // For employers, fetch posted jobs
          const jobsResponse = await axios.get('/jobs/employer');
          setPostedJobs(jobsResponse.data);
          
          // Fetch applications for all posted jobs
          if (jobsResponse.data.length > 0) {
            const applicationsResponse = await axios.get('/applications/employer');
            setApplications(applicationsResponse.data);
          }
        } else {
          // For job seekers, fetch their applications
          const applicationsResponse = await axios.get('/applications');
          setApplications(applicationsResponse.data);
          
          // Fetch saved jobs if needed
          const savedJobsResponse = await axios.get('/users/saved-jobs');
          setSavedJobs(savedJobsResponse.data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole]);

  // Format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Update application status (for employers)
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await axios.put(`/applications/${applicationId}`, { status: newStatus });
      
      // Update the application status in the UI
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('Failed to update application status. Please try again.');
    }
  };

  // Delete a job posting (for employers)
  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await axios.delete(`/jobs/${jobId}`);
        
        // Remove the job from the UI
        setPostedJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
        
        // Also remove any applications for this job
        setApplications(prevApplications => 
          prevApplications.filter(app => app.job._id !== jobId)
        );
      } catch (err) {
        console.error('Error deleting job:', err);
        alert('Failed to delete job. Please try again.');
      }
    }
  };

  // Withdraw an application (for candidates)
  const withdrawApplication = async (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await axios.delete(`/applications/${applicationId}`);
        
        // Remove the application from the UI
        setApplications(prevApplications => 
          prevApplications.filter(app => app._id !== applicationId)
        );
      } catch (err) {
        console.error('Error withdrawing application:', err);
        alert('Failed to withdraw application. Please try again.');
      }
    }
  };

  // Remove a saved job (for candidates)
  const removeSavedJob = async (jobId) => {
    try {
      await axios.delete(`/users/saved-jobs/${jobId}`);
      
      // Remove the job from the UI
      setSavedJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
    } catch (err) {
      console.error('Error removing saved job:', err);
      alert('Failed to remove saved job. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 p-6 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Dashboard</h1>
        
        {userRole === 'employer' && (
          <Link to="/post-job" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 border border-yellow-500">
            + Post New Job
          </Link>
        )}
      </div>

      {/* Dashboard Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex flex-wrap -mb-px">
          {userRole === 'employer' && (
            <>
              <button
                className={`mr-8 py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'postedJobs' 
                    ? 'border-yellow-500 text-yellow-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('postedJobs')}
              >
                Posted Jobs ({postedJobs.length})
              </button>
              <button
                className={`mr-8 py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'applications' 
                    ? 'border-yellow-500 text-yellow-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('applications')}
              >
                Applications ({applications.length})
              </button>
            </>
          )}
          
          {userRole === 'candidate' && (
            <>
              <button
                className={`mr-8 py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'applications' 
                    ? 'border-yellow-500 text-yellow-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('applications')}
              >
                My Applications ({applications.length})
              </button>
              <button
                className={`mr-8 py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === 'savedJobs' 
                    ? 'border-yellow-500 text-yellow-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('savedJobs')}
              >
                Saved Jobs ({savedJobs.length})
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {/* Posted Jobs Tab (Employers) */}
        {activeTab === 'postedJobs' && userRole === 'employer' && (
          <div>
            {postedJobs.length === 0 ? (
              <div className="bg-yellow-100 p-6 rounded-lg text-center">
                <p className="text-yellow-700 mb-4">You haven't posted any jobs yet.</p>
                <Link to="/post-job" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                  Post Your First Job
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {postedJobs.map(job => {
                      const jobApplications = applications.filter(app => app.job._id === job._id);
                      
                      return (
                        <tr key={job._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                            <div className="text-sm text-gray-500">{job.company}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{job.location}</div>
                            <div className="text-sm text-gray-500">{job.type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-purple-600">{jobApplications.length} applications</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(job.createdAt)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              job.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {job.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link to={`/jobs/${job._id}`} className="text-purple-600 hover:text-purple-900 mr-3">View</Link>
                            <Link to={`/jobs/${job._id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</Link>
                            <button 
                              onClick={() => deleteJob(job._id)} 
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            {applications.length === 0 ? (
              <div className="bg-yellow-100 p-6 rounded-lg text-center">
                <p className="text-yellow-700 mb-4">
                  {userRole === 'employer' 
                    ? 'No applications received yet for your job postings.' 
                    : 'You haven\'t applied to any jobs yet.'}
                </p>
                {userRole === 'candidate' && (
                  <Link to="/jobs" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                    Browse Jobs
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      {userRole === 'employer' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {applications.map(application => (
                      <tr key={application._id}>
                        {userRole === 'employer' && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{application.candidate.name}</div>
                                <div className="text-sm text-gray-500">{application.candidate.email}</div>
                              </div>
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{application.job.title}</div>
                          <div className="text-sm text-gray-500">{application.job.company}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(application.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {userRole === 'employer' ? (
                            <select
                              value={application.status}
                              onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                              className="text-sm rounded border border-gray-300 px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="interviewed">Interviewed</option>
                              <option value="offered">Offered</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          ) : (
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              application.status === 'reviewed' ? 'bg-purple-100 text-purple-800' :
                              application.status === 'interviewed' ? 'bg-purple-100 text-purple-800' :
                              application.status === 'offered' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {userRole === 'employer' ? (
                            <>
                              <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-900 mr-3">
                                View Resume
                              </a>
                              <Link to={`/jobs/${application.job._id}`} className="text-indigo-600 hover:text-indigo-900">
                                View Job
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link to={`/jobs/${application.job._id}`} className="text-purple-600 hover:text-purple-900 mr-3">
                                View Job
                              </Link>
                              <button 
                                onClick={() => withdrawApplication(application._id)} 
                                className="text-red-600 hover:text-red-900"
                              >
                                Withdraw
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Saved Jobs Tab (Candidates) */}
        {activeTab === 'savedJobs' && userRole === 'candidate' && (
          <div>
            {savedJobs.length === 0 ? (
              <div className="bg-yellow-100 p-6 rounded-lg text-center">
                <p className="text-yellow-700 mb-4">You haven't saved any jobs yet.</p>
                <Link to="/jobs" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {savedJobs.map(job => (
                  <div key={job._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
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
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm mb-2">{job.type}</span>
                        {job.salary && <p className="text-gray-700 mb-2">Salary: {job.salary}</p>}
                        <p className="text-gray-500 text-sm">Posted: {formatDate(job.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 5).map((skill, index) => (
                          <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">{skill}</span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">+{job.skills.length - 5} more</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-3">
                      <Link 
                        to={`/jobs/${job._id}`} 
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                      >
                        View Details
                      </Link>
                      <button 
                        onClick={() => removeSavedJob(job._id)} 
                        className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 