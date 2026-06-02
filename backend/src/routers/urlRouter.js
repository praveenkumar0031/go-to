const express=require("express");
const { createShortUrl,updateUrl,deleteUrl,getUserUrls } =require('../controllers/UrlController.js');
const { getUrlAnalytics, handleRedirect,getUserLogs } = require('../controllers/AnalyticsController.js');
const {rateLimiter,userLimiter} = require("../middleware/rateLimit");

const { auth } = require("../middleware/authenticate");
const router = express.Router();

// POST /api/urls 
// Protected: Only authenticated users can generate short links
router.post('/', auth, createShortUrl);

// GET /api/urls/:shortCode
router.get('/:shortCode/analytics', auth,userLimiter, getUrlAnalytics);
router.get('/:shortCode', handleRedirect);
router.put('/:shortCode',  auth,userLimiter, updateUrl);
router.delete('/:shortCode',auth,userLimiter, deleteUrl);
router.get('/', rateLimiter,auth, getUserUrls);
router.get('/logs/all', rateLimiter,auth, getUserLogs);
// (Future Phase) GET /api/urls/:id/analytics
// router.get('/:id/analytics', authMiddleware, getUrlAnalytics);

module.exports = router;