import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    company: '',
    location: '',
    type: 'Full-time',
    category: '',
    experience: 'Entry-level',
    salary: '',
    skills: '',
    applicationDeadline: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const experienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Executive'];
  const jobCategories = [
    'Technology', 'Healthcare', 'Education', 'Finance', 
    'Marketing', 'Sales', 'Design', 'Engineering', 
    'Customer Service', 'Administrative', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const requiredFields = ['title', 'description', 'requirements', 'company', 'location', 'type', 'category'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    if (!formData.skills) {
      newErrors.skills = 'Please specify at least one required skill';
    }
    
    if (formData.applicationDeadline) {
      const deadlineDate = new Date(formData.applicationDeadline);
      const currentDate = new Date();
      
      if (deadlineDate < currentDate) {
        newErrors.applicationDeadline = 'Application deadline cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const formattedData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim())
      };
      
      await axios.post('/jobs', formattedData);
      
      setSuccess(true);
      setLoading(false);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error posting job:', err);
      
      if (err.response?.data?.errors) {
        const apiErrors = {};
        err.response.data.errors.forEach(error => {
          apiErrors[error.param] = error.msg;
        });
        setErrors(apiErrors);
      } else {
        setErrors({ general: err.response?.data?.message || 'Failed to post job. Please try again.' });
      }
      
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-green-100 p-6 rounded-lg text-center">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Job Posted Successfully!</h2>
            <p className="text-green-700 mb-4">Your job has been posted and is now live. Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Post a New Job</h1>
          
          {errors.general && (
            <div className="bg-red-100 p-3 rounded mb-4">
              <p className="text-red-700">{errors.general}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Job Details</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="title" className="block text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. Senior Frontend Developer"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded ${errors.company ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. Acme Inc."
                  />
                  {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location" className="block text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g. San Francisco, CA or Remote"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="type" className="block text-gray-700 mb-2">Job Type</label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      {jobTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-gray-700 mb-2">Job Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select a category</option>
                      {jobCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="block text-gray-700 mb-2">Experience Level</label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded"
                    >
                      {experienceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="salary" className="block text-gray-700 mb-2">Salary Range (Optional)</label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded"
                    placeholder="e.g. $80,000 - $100,000 per year"
                  />
                </div>
                
                <div>
                  <label htmlFor="applicationDeadline" className="block text-gray-700 mb-2">Application Deadline (Optional)</label>
                  <input
                    type="date"
                    id="applicationDeadline"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded ${errors.applicationDeadline ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.applicationDeadline && <p className="text-red-500 text-sm mt-1">{errors.applicationDeadline}</p>}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Job Description & Requirements</h2>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 mb-2">Job Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded h-32 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Describe the job responsibilities, role, and what the candidate will be doing..."
                ></textarea>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="requirements" className="block text-gray-700 mb-2">Job Requirements</label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded h-32 ${errors.requirements ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="List the qualifications, experience, and education requirements..."
                ></textarea>
                {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
              </div>
              
              <div>
                <label htmlFor="skills" className="block text-gray-700 mb-2">Required Skills (comma-separated)</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded ${errors.skills ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g. JavaScript, React, Node.js, TypeScript"
                />
                {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob; 