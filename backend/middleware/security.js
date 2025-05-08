const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// Security middleware
exports.securityMiddleware = (app) => {
  // Enable CORS with specific options
  app.use(cors({
    origin: 'http://localhost:3000', // Allow frontend origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Set security HTTP headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // Prevent XSS attacks
  app.use(xss());

  // Sanitize data
  app.use(mongoSanitize());

  // Prevent parameter pollution
  app.use(hpp());

  // Rate limiting - more permissive for development
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 1000 requests per windowMs
  });
  
  // Apply rate limiting to all routes except auth
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/auth')) {
      next();
    } else {
      limiter(req, res, next);
    }
  });
};

// Error handling middleware
exports.errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);

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