const mongoose =require("mongoose");
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URL;
    if (!uri) throw new Error("MONGO_URL is not defined in .env");
    await mongoose.connect(uri);
    console.log("MongoDB Connection established");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports=connectDB;