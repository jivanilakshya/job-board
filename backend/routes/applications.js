const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only PDF and Word documents are allowed!');
    }
  }
});

// @route   POST /api/applications
// @desc    Submit job application
// @access  Private (candidates only)
router.post('/', protect, authorize('candidate'), upload.single('resume'), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload your resume' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const application = new Application({
      job: jobId,
      candidate: req.user._id,
      resumeUrl: `/uploads/resumes/${req.file.filename}`,
      coverLetter
    });

    await application.save();

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications
// @desc    Get all applications for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let applications;
    
    if (req.user.role === 'candidate') {
      // Get applications submitted by candidate
      applications = await Application.find({ candidate: req.user._id })
        .populate({
          path: 'job',
          select: 'title company location type'
        });
    } else if (req.user.role === 'employer') {
      // Get applications for jobs posted by employer
      const jobs = await Job.find({ employer: req.user._id }).select('_id');
      const jobIds = jobs.map(job => job._id);
      
      applications = await Application.find({ job: { $in: jobIds } })
        .populate({
          path: 'job',
          select: 'title company location type'
        })
        .populate({
          path: 'candidate',
          select: 'name email'
        });
    }

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/:id
// @desc    Get application by ID
// @access  Private (application owner, job owner, or admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'job',
        select: 'title company location type employer'
      })
      .populate({
        path: 'candidate',
        select: 'name email'
      });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check authorization
    const job = await Job.findById(application.job._id);
    
    if (
      application.candidate._id.toString() !== req.user._id.toString() && 
      job.employer.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to access this application' });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application status
// @access  Private (job owner or admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    let application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check authorization (only job owner or admin can update status)
    const job = await Job.findById(application.job);
    
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    // Update application
    application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    ).populate({
      path: 'job',
      select: 'title company'
    }).populate({
      path: 'candidate',
      select: 'name email'
    });

    res.json({
      success: true,
      data: application
    });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Withdraw application
// @access  Private (application owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only candidate who applied can withdraw
    if (application.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to withdraw this application' });
    }

    await application.deleteOne();

    res.json({ success: true, message: 'Application withdrawn' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 