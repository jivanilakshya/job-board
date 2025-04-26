const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true,
    maxlength: [100, 'Job title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide job description']
  },
  requirements: {
    type: String,
    required: [true, 'Please provide job requirements']
  },
  company: {
    type: String,
    required: [true, 'Please provide company name']
  },
  location: {
    type: String,
    required: [true, 'Please provide job location']
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
    required: [true, 'Please specify job type']
  },
  category: {
    type: String,
    required: [true, 'Please specify job category']
  },
  experience: {
    type: String,
    enum: ['Entry-level', 'Mid-level', 'Senior', 'Executive'],
    required: [true, 'Please specify experience level']
  },
  salary: {
    type: String
  },
  skills: {
    type: [String],
    required: [true, 'Please specify required skills']
  },
  applicationDeadline: {
    type: Date
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search functionality
JobSchema.index({
  title: 'text',
  description: 'text',
  company: 'text',
  location: 'text',
  skills: 'text'
});

module.exports = mongoose.model('Job', JobSchema); 