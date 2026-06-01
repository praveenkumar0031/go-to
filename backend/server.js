const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./src/config/db");
const http = require("http");
const cors = require("cors");
const authrouter = require("./src/routers/userRouter");

dotenv.config();
connectDb();
const frontend=process.env.FRONTEND_URL||"http://localhost:5173";
const app = express();
app.use(cors({
  origin: frontend,
  credentials: true
}));
const server = http.createServer(app);
app.use(express.json());



app.use("/api/goto", authrouter);



const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
