const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required: false},
    googleId:{type:String},
    avatar:{type:String},
    resetOtp: String,
    resetOtpExpires: Date
});
module.exports=mongoose.model("user",userSchema);
