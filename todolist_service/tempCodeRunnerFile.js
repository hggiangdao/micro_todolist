require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const fs = require("fs");

// Kết nối MongoDB
connectDB();
const app = express();
app.use(express.json());

// Middleware log request
app.use((req, res, next) => {
  const logMessage = `[${req.method}] ${req.originalUrl}`;
  console.log(logMessage);
  fs.appendFileSync("logs/requests.log", `${new Date().toISOString()} - ${logMessage}\n`);
  next();
});

// Routes
app.use("/api/tasks", taskRoutes);

// Khởi chạy server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Task Service running on port ${PORT}`));
