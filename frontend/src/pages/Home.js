import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Dream Job Today</h1>
          <p className="text-xl mb-8">Connect with top employers and discover opportunities that match your skills and career goals.</p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/jobs" className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Browse Jobs
            </Link>
            <Link to="/register" className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Job Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* This would typically be populated from an API */}
            <FeaturedJobCard 
              title="Senior Frontend Developer"
              company="Tech Innovations Inc."
              location="San Francisco, CA"
              type="Full-time"
            />
            <FeaturedJobCard 
              title="Data Scientist"
              company="Analytics Pro"
              location="New York, NY"
              type="Full-time"
            />
            <FeaturedJobCard 
              title="UX/UI Designer"
              company="Creative Solutions"
              location="Remote"
              type="Contract"
            />
          </div>
          <div className="text-center mt-10">
            <Link to="/jobs" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 border border-yellow-500">
              View All Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-yellow-500 text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Create an Account</h3>
              <p className="text-gray-600">Sign up as a job seeker or employer to get started on your journey.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-yellow-500 text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Browse or Post Jobs</h3>
              <p className="text-gray-600">Search for opportunities or post job openings to find the perfect match.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-yellow-500 text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Apply or Hire</h3>
              <p className="text-gray-600">Submit applications to jobs or review candidates and make hiring decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic mb-4">"I found my dream job within two weeks of using JobBoard. The platform is intuitive and the job matching algorithm is spot on!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-600">Software Engineer</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic mb-4">"As an employer, JobBoard has simplified our hiring process. We've found amazing candidates who are perfect fits for our company culture."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Michael Rodriguez</h4>
                  <p className="text-gray-600">HR Director, TechCorp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">Join thousands of professionals who have found success with JobBoard.</p>
          <Link to="/register" className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

// Featured Job Card Component
const FeaturedJobCard = ({ title, company, location, type }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{company}</p>
      <div className="flex items-center text-gray-500 mb-4">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <span>{location}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">{type}</span>
        <Link to="/jobs/1" className="text-yellow-600 hover:text-yellow-700 font-medium">View Details</Link>
      </div>
    </div>
  );
};

export default Home; 