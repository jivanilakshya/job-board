import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import JobListings from './pages/JobListings';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import SavedJobs from './pages/SavedJobs';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<JobListings />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              
              {/* Protected Routes */}
              <Route
                path="/candidate/dashboard"
                element={
                  <PrivateRoute role="candidate">
                    <CandidateDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/employer/dashboard"
                element={
                  <PrivateRoute role="employer">
                    <EmployerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/post-job"
                element={
                  <PrivateRoute role="employer">
                    <PostJob />
                  </PrivateRoute>
                }
              />
              <Route
                path="/saved-jobs"
                element={
                  <PrivateRoute role="candidate">
                    <SavedJobs />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App; 