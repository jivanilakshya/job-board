const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');
const User = require('../models/User');

// @route   GET /api/jobs/saved
// @desc    Get user's saved jobs
// @access  Private
router.get('/saved', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedJobs',
      select: 'title company location type category experience salary skills',
      populate: {
        path: 'employer',
        select: 'name company'
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only return saved jobs for candidates
    if (user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can save jobs' });
    }

    res.json({
      success: true,
      data: user.savedJobs
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/featured
// @desc    Get featured jobs
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const jobs = await Job.find({ featured: true, active: true })
      .sort('-createdAt')
      .limit(6)
      .populate({
        path: 'employer',
        select: 'name company'
      });

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      location, 
      category, 
      type, 
      experience, 
      featured,
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = { active: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by job type
    if (type) {
      query.type = type;
    }

    // Filter by experience level
    if (experience) {
      query.experience = experience;
    }

    // Filter by featured status
    if (featured === 'true') {
      query.featured = true;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const jobs = await Job.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: 'employer',
        select: 'name company'
      });

    // Get total count
    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      count: jobs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: jobs
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate({
      path: 'employer',
      select: 'name company'
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs
// @desc    Create a job
// @access  Private (employers only)
router.post('/', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      company,
      location,
      type,
      category,
      experience,
      salary,
      skills,
      applicationDeadline,
      featured
    } = req.body;

    // Create job
    const job = new Job({
      title,
      description,
      requirements,
      company: company || req.user.company,
      location,
      type,
      category,
      experience,
      salary,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()),
      applicationDeadline,
      featured,
      employer: req.user._id
    });

    await job.save();

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Private (job owner or admin)
router.put('/:id', protect, async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check job ownership
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    // Format skills if provided
    if (req.body.skills && !Array.isArray(req.body.skills)) {
      req.body.skills = req.body.skills.split(',').map(skill => skill.trim());
    }

    // Update job
    job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: job
    });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete job
// @access  Private (job owner or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check job ownership
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.json({ success: true, message: 'Job removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs/:id/apply
// @desc    Apply for a job
// @access  Private (candidates only)
router.post('/:id/apply', protect, authorize('candidate'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Create application
    const application = {
      candidate: req.user._id,
      job: job._id,
      status: 'pending',
      ...req.body
    };

    // Save application to job
    job.applications.push(application);
    await job.save();

    // Send notification to candidate
    await sendEmail(
      req.user.email,
      'applicationSubmitted',
      [job.title, job.company]
    );

    // Send notification to employer
    const employer = await User.findById(job.employer);
    if (employer) {
      await sendEmail(
        employer.email,
        'newApplicationReceived',
        [job.title, req.user.name]
      );
    }

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/jobs/:id/applications/:applicationId
// @desc    Update application status
// @access  Private (employers only)
router.put('/:id/applications/:applicationId', protect, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const application = job.applications.id(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update application status
    application.status = req.body.status;
    await job.save();

    // Send notification to candidate
    const candidate = await User.findById(application.candidate);
    if (candidate) {
      await sendEmail(
        candidate.email,
        'applicationStatusUpdate',
        [job.title, job.company, req.body.status]
      );
    }

    res.json({
      success: true,
      data: application
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs/:id/save
// @desc    Save a job
// @access  Private
router.post('/:id/save', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const user = await User.findById(req.user._id);

    // Check if job is already saved
    if (user.savedJobs.includes(job._id)) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    // Add job to saved jobs
    user.savedJobs.push(job._id);
    await user.save();

    res.json({
      success: true,
      message: 'Job saved successfully'
    });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/jobs/:id/save
// @desc    Unsave a job
// @access  Private
router.delete('/:id/save', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const user = await User.findById(req.user._id);

    // Check if job is saved
    if (!user.savedJobs.includes(job._id)) {
      return res.status(400).json({ message: 'Job is not saved' });
    }

    // Remove job from saved jobs
    user.savedJobs = user.savedJobs.filter(
      savedJob => savedJob.toString() !== job._id.toString()
    );
    await user.save();

    res.json({
      success: true,
      message: 'Job unsaved successfully'
    });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 