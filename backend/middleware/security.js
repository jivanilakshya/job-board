const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// Security middleware
exports.securityMiddleware = (app) => {
  // Set security HTTP headers
  app.use(helmet());

  // Prevent XSS attacks
  app.use(xss());

  // Sanitize data
  app.use(mongoSanitize());

  // Prevent parameter pollution
  app.use(hpp());

  // Enable CORS
  app.use(cors());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);
};

// Error handling middleware
exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
};

// Not found middleware
exports.notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found'
  });
}; 