import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`http://localhost:5000/api/applications/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setApplication(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching application details:', error);
        setError(error.response?.data?.message || 'Error loading application details');
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/applications/${id}`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setApplication(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
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
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{application.job.title}</h1>
                <p className="text-gray-600">{application.job.company}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  application.status === 'interview' ? 'bg-green-100 text-green-800' :
                  application.status === 'offered' ? 'bg-purple-100 text-purple-800' :
                  application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {application.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Candidate Information</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {application.candidate.name}</p>
                  <p><span className="font-medium">Email:</span> {application.candidate.email}</p>
                  <p><span className="font-medium">Phone:</span> {application.candidate.phone || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-4">Application Details</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Applied On:</span> {new Date(application.createdAt).toLocaleDateString()}</p>
                  <p><span className="font-medium">Last Updated:</span> {new Date(application.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {application.coverLetter && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Cover Letter</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{application.coverLetter}</p>
                </div>
              </div>
            )}

            {application.resume && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Resume</h2>
                <a
                  href={application.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Resume
                </a>
              </div>
            )}

            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300"
              >
                Go Back
              </button>
              <div className="flex gap-2">
                <select
                  value={application.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="p-2 border rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail; 