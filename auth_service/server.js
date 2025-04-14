const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1); // Thoát nếu lỗi kết nối
});

db.once("open", () => {
  console.log("✅ Connected to MongoDB");

  // Middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use("/api/auth", authRoutes);

  // Start server sau khi MongoDB kết nối thành công
  app.listen(PORT, () => console.log(`✅ Auth Service running on port ${PORT}`));
});
