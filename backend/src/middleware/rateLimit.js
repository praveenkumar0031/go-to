const Limit = require('express-rate-limit');


const rateLimiter = Limit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 100, 
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, 
});


const strictLimiter = Limit({
  windowMs: 30 * 60 * 1000, // 1/2 hour
  max: 100, // Limit each IP to 15 requests per hour for sensitive routes
  message: { error: 'Too many attempts from this IP, please try again after an hour.' }
});
const userLimiter = Limit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per 15 minutes per user
  message: { error: 'You have reached your action limit. Please pause for a moment.' },
  
  // THE MAGIC KEY: Override the default IP tracking and use the User ID
  keyGenerator: (req, res) => {
    return req.user.id; // Extracts the ID attached by your authMiddleware
  }
});
module.exports = { rateLimiter, strictLimiter, userLimiter};