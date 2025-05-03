import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate',
    company: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.role === 'employer' && !formData.company) {
      newErrors.company = 'Company name is required for employers';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        company: formData.role === 'employer' ? formData.company : undefined
      });
      
      if (response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Set default authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Navigate based on role
        if (formData.role === 'employer') {
          navigate('/employer/dashboard');
        } else {
          navigate('/candidate/dashboard');
        }
      }
    } catch (error) {
      console.error('Error registering:', error);
      if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = {};
        error.response.data.errors.forEach(err => {
          validationErrors[err.param] = err.msg;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ submit: error.response?.data?.message || 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Full Name</label>
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
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${errors.confirmPassword ? 'border-red-500' : ''}`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-2">I want to</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="candidate"
                    checked={formData.role === 'candidate'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Find a Job
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="employer"
                    checked={formData.role === 'employer'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Post Jobs
                </label>
              </div>
            </div>
            {formData.role === 'employer' && (
              <div>
                <label className="block text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${errors.company ? 'border-red-500' : ''}`}
                />
                {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
              </div>
            )}
            {errors.submit && (
              <p className="text-red-500 text-sm">{errors.submit}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-black hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 