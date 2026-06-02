const express=require("express");

const { getUrlAnalytics, handleRedirect,getUserLogs,getTodayLogs } = require('../controllers/AnalyticsController.js');
const {rateLimiter,userLimiter} = require("../middleware/rateLimit");

const { auth } = require("../middleware/authenticate");
const router = express.Router();


router.get('/:shortCode/analytics', auth,userLimiter, getUrlAnalytics);
router.get('/:shortCode', handleRedirect);
router.get('/logs/all', rateLimiter,auth, getUserLogs);
router.get("/logs/today",auth,userLimiter,getTodayLogs);


module.exports = router;