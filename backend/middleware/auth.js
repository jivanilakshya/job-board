const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Rate limiting middleware
exports.rateLimit = (maxRequests, windowMs) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old requests
    for (const [key, value] of requests.entries()) {
      if (value.timestamp < windowStart) {
        requests.delete(key);
      }
    }

    // Check if IP has exceeded limit
    const userRequests = requests.get(ip) || { count: 0, timestamp: now };
    if (userRequests.count >= maxRequests) {
      return res.status(429).json({
        message: 'Too many requests, please try again later'
      });
    }

    // Update request count
    requests.set(ip, {
      count: userRequests.count + 1,
      timestamp: now
    });

    next();
  };
}; 