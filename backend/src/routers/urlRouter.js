const express=require("express");
const { createShortUrl } =require('../controllers/UrlController.js');
// Import your JWT authentication middleware

const { auth } = require("../middleware/authenticate");
const router = express.Router();

// POST /api/urls 
// Protected: Only authenticated users can generate short links
router.post('/', auth, createShortUrl);

// (Future Phase) GET /api/urls/:id/analytics
// router.get('/:id/analytics', authMiddleware, getUrlAnalytics);

module.exports = router;