const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    // Remove password from fields to be updated
    const { password, ...updateFields } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/employers
// @desc    Get all employers
// @access  Public
router.get('/employers', async (req, res) => {
  try {
    const employers = await User.find({ role: 'employer' })
      .select('-password -experience -education');

    res.json({
      success: true,
      count: employers.length,
      data: employers
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/password
// @desc    Update password
// @access  Private
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/experience
// @desc    Add experience to profile
// @access  Private
router.put('/experience', protect, async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    const user = await User.findById(req.user._id);
    user.experience.unshift(newExp);
    await user.save();

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/education
// @desc    Add education to profile
// @access  Private
router.put('/education', protect, async (req, res) => {
  try {
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    const user = await User.findById(req.user._id);
    user.education.unshift(newEdu);
    await user.save();

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get remove index
    const removeIndex = user.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    if (removeIndex === -1) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    user.experience.splice(removeIndex, 1);
    await user.save();

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get remove index
    const removeIndex = user.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    if (removeIndex === -1) {
      return res.status(404).json({ message: 'Education not found' });
    }

    user.education.splice(removeIndex, 1);
    await user.save();

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/saved-jobs/:jobId
// @desc    Save a job
// @access  Private
router.post('/saved-jobs/:jobId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check if job is already saved
    if (user.savedJobs.includes(req.params.jobId)) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    user.savedJobs.push(req.params.jobId);
    await user.save();

    res.json({
      success: true,
      data: user.savedJobs
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/saved-jobs
// @desc    Get all saved jobs
// @access  Private
router.get('/saved-jobs', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedJobs',
      select: 'title company location type category experience'
    });

    res.json({
      success: true,
      count: user.savedJobs.length,
      data: user.savedJobs
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/saved-jobs/:jobId
// @desc    Remove a saved job
// @access  Private
router.delete('/saved-jobs/:jobId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get remove index
    const removeIndex = user.savedJobs.indexOf(req.params.jobId);
    
    if (removeIndex === -1) {
      return res.status(404).json({ message: 'Job not found in saved jobs' });
    }

    user.savedJobs.splice(removeIndex, 1);
    await user.save();

    res.json({
      success: true,
      data: user.savedJobs
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