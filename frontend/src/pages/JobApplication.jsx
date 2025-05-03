import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
        setJob(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job:', error);
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.resume) newErrors.resume = 'Resume is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      await axios.post(`http://localhost:5000/api/jobs/${jobId}/apply`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">{job.title}</h2>
            <p className="text-gray-600 mb-2">{job.company}</p>
            <p className="text-gray-500 mb-4">{job.location}</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Resume</label>
              <input
                type="file"
                name="resume"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
                className={`w-full p-3 border rounded-lg ${errors.resume ? 'border-red-500' : ''}`}
              />
              {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Cover Letter</label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm mb-4">{errors.submit}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplication; 