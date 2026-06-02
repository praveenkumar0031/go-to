const express=require("express");
const { createShortUrl,updateUrl,deleteUrl,getUserUrls } =require('../controllers/UrlController.js');
const { getUrlAnalytics, handleRedirect,getUserLogs,getTodayLogs } = require('../controllers/AnalyticsController.js');
const {rateLimiter,userLimiter} = require("../middleware/rateLimit");

const { auth } = require("../middleware/authenticate");
const router = express.Router();

// POST /api/urls 
// Protected: Only authenticated users can generate short links
router.post('/', auth, createShortUrl);

// GET /api/urls/:shortCode


router.put('/:shortCode',  auth,userLimiter, updateUrl);
router.delete('/:shortCode',auth,userLimiter, deleteUrl);
router.get('/', rateLimiter,auth, getUserUrls);


// (Future Phase) GET /api/urls/:id/analytics
// router.get('/:id/analytics', authMiddleware, getUrlAnalytics);

module.exports = router;