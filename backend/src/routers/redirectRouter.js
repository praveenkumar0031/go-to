const express=require("express");
// Assuming you placed handleRedirect in the url.controller or a dedicated redirect.controller
const { handleRedirect } =require( '../controllers/AnalyticsController.js'); 

const router = express.Router();

// GET /:shortCode
// Public: Anyone clicking the link gets redirected immediately
router.get('/:shortCode', handleRedirect);

module.exports = router;