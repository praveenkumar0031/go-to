const express=require("express");
const router=express.Router();
const {signupUser,loginUser,getUserById,oAuth} =require('../controllers/AuthController');
const {rateLimiter,strictLimiter} = require("../middleware/rateLimit");
const { auth } = require("../middleware/authenticate");
const {requestPasswordReset,resetPassword} =require('../controllers/UserController');
router.post("/signup",rateLimiter,signupUser);
router.post("/login",strictLimiter,loginUser);
router.get("/user",rateLimiter,getUserById);
router.post("/auth/google", oAuth);
router.post("/user/forget",requestPasswordReset);
router.post("/user/reset",strictLimiter,resetPassword);

module.exports=router;