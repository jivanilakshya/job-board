import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: ''
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleInputChange = (e) => {
    setApplication({
      ...application,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setApplication({
      ...application,
      resume: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(application).forEach(key => {
        formData.append(key, application[key]);
      });

      await axios.post(`http://localhost:5000/api/jobs/${id}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Application submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
              <div className="flex items-center mb-4">
                <span className="text-gray-600 mr-4">{job.company}</span>
                <span className="text-gray-500">{job.location}</span>
              </div>
              <div className="flex gap-2 mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {job.jobType}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  {job.experience}
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  ${job.salary}
                </span>
              </div>
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-2">Job Description</h2>
                <p className="mb-4">{job.description}</p>
                <h2 className="text-xl font-semibold mb-2">Requirements</h2>
                <ul className="list-disc pl-5 mb-4">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
                <h2 className="text-xl font-semibold mb-2">Benefits</h2>
                <ul className="list-disc pl-5">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-2xl font-bold mb-4">Apply for this Position</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={application.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={application.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={application.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Resume</label>
                  <input
                    type="file"
                    name="resume"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Cover Letter</label>
                  <textarea
                    name="coverLetter"
                    value={application.coverLetter}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail; 