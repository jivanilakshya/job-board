import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicationsResponse, profileResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/applications/candidate'),
          axios.get('http://localhost:5000/api/profile')
        ]);
        setApplications(applicationsResponse.data);
        setProfile(profileResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Candidate Dashboard</h1>
          <Link
            to="/profile/edit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-auto text-center"
          >
            Edit Profile
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col sm:flex-row border-b">
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
                activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              My Profile
            </button>
          </div>

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
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {application.status}
                          </span>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
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

          {activeTab === 'profile' && profile && (
            <div className="p-4">
              <div className="bg-white border rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Name:</span> {profile.name}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Email:</span> {profile.email}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Phone:</span> {profile.phone}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Location:</span> {profile.location}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Professional Information</h3>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Title:</span> {profile.title}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Experience:</span> {profile.experience}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Education:</span> {profile.education}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Skills:</span> {profile.skills.join(', ')}
                    </p>
                  </div>
                </div>
                {profile.resume && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Resume</h3>
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