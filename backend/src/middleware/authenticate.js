const jwt = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
  try {

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    next();

  } catch (error) {
    console.error('Auth Middleware Error:', error);

    return res.status(401).json({
      error: 'Invalid token'
    });
  }
};