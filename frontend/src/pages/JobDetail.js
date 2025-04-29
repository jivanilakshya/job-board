import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobDetail = ({ isAuthenticated, userRole }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/jobs/${id}`);
        setJob(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch job details. Please try again later.');
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    setShowApplyForm(true);
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (!resumeFile) {
      setSubmitError('Please upload your resume');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);
      
      // Create a FormData object to send file
      const formData = new FormData();
      formData.append('job', id);
      formData.append('resume', resumeFile);
      formData.append('coverLetter', coverLetter);
      
      await axios.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Success! Hide form and show success message
      setShowApplyForm(false);
      alert('Your application has been submitted successfully!');
    } catch (err) {
      console.error('Error submitting application:', err);
      setSubmitError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async () => {
    if (window.confirm('Are you sure you want to delete this job listing? This action cannot be undone.')) {
      try {
        await axios.delete(`/jobs/${id}`);
        navigate('/dashboard');
      } catch (err) {
        console.error('Error deleting job:', err);
        alert('Failed to delete job. Please try again.');
      }
    }
  };

  // Format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 p-6 rounded-lg">
          <p className="text-red-700">{error}</p>
          <Link to="/jobs" className="text-blue-600 hover:underline mt-4 inline-block">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 p-6 rounded-lg">
          <p className="text-yellow-700">Job not found.</p>
          <Link to="/jobs" className="text-blue-600 hover:underline mt-4 inline-block">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/jobs" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Jobs
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <p className="text-xl text-gray-600">{job.company}</p>
          </div>
          
          {/* Admin or Owner Actions */}
          {isAuthenticated && (userRole === 'admin' || (userRole === 'employer' && job.employer === localStorage.getItem('userId'))) && (
            <div className="flex mt-4 md:mt-0">
              <Link to={`/jobs/${id}/edit`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
                Edit
              </Link>
              <button 
                onClick={handleDeleteJob}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        
        <div className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>{job.location}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span>{job.type}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <span>{job.category}</span>
            </div>
            
            {job.salary && (
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{job.salary}</span>
              </div>
            )}
            
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>Posted on {formatDate(job.createdAt)}</span>
            </div>
          </div>
          
          {!showApplyForm && (
            <button 
              onClick={handleApply}
              disabled={userRole === 'employer'}
              className={`mt-4 px-6 py-3 rounded-lg font-semibold ${
                userRole === 'employer' 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-600' 
                  : 'bg-black text-white hover:bg-gray-900 border border-yellow-500'
              }`}
            >
              {userRole === 'employer' ? 'Employers Cannot Apply' : 'Apply for this Job'}
            </button>
          )}
          
          {/* Application Form */}
          {showApplyForm && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Submit Your Application</h3>
              <form onSubmit={handleSubmitApplication}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="resume">Resume (PDF, DOC, DOCX)</label>
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="coverLetter">Cover Letter (Optional)</label>
                  <textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded h-32"
                    placeholder="Describe why you're a good fit for this position..."
                  ></textarea>
                </div>
                
                {submitError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {submitError}
                  </div>
                )}
                
                <div className="flex items-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 mr-2 border border-yellow-500"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        
        {/* Job Details */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
          <div className="text-gray-700 space-y-4">
            <p>{job.description}</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
          <div className="text-gray-700 space-y-4">
            <p>{job.requirements}</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        {job.applicationDeadline && (
          <div className="text-gray-600 italic">
            <p>Applications accepted until {formatDate(job.applicationDeadline)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail; 