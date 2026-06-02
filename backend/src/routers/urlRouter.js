const express=require("express");
const { createShortUrl,updateUrl,deleteUrl,getUserUrls } =require('../controllers/UrlController.js');
const { getUrlAnalytics, handleRedirect,getUserLogs } = require('../controllers/AnalyticsController.js');
// Import your JWT authentication middleware

const { auth } = require("../middleware/authenticate");
const router = express.Router();

// POST /api/urls 
// Protected: Only authenticated users can generate short links
router.post('/', auth, createShortUrl);

// GET /api/urls/:shortCode
router.get('/:shortCode/analytics', auth, getUrlAnalytics);
router.get('/:shortCode', handleRedirect);
router.put('/:shortCode', auth, updateUrl);
router.delete('/:shortCode', auth, deleteUrl);
router.get('/', auth, getUserUrls);
router.get('/logs/all', auth, getUserLogs);
// (Future Phase) GET /api/urls/:id/analytics
// router.get('/:id/analytics', authMiddleware, getUrlAnalytics);

module.exports = router;