const express=require("express");
const router=express.Router();
const {signupUser,loginUser,getUserById,oAuth} =require('../controllers/AuthController');
const { auth } = require("../middleware/authenticate");
const {requestPasswordReset,resetPassword} =require('../controllers/UserController');
router.post("/signup",signupUser);
router.post("/login",loginUser);
router.get("/user",auth,getUserById);
router.post("/auth/google", oAuth);
router.post("/user/forget",requestPasswordReset);
router.post("/user/reset",resetPassword);

module.exports=router;