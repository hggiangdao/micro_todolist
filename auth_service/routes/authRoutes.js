const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const router = express.Router();

// 🔐 Đăng ký
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  console.log("📩 [REGISTER] Email:", email);
  console.log("🔑 [REGISTER] Mật khẩu gốc:", password);

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    // Kiểm tra user đã tồn tại
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("⚠️ [REGISTER] User đã tồn tại!");
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Tạo user mới
    const user = new User({ email, password });
    await user.save();

    console.log("✅ [REGISTER SUCCESS] userId:", user.userId);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { userId: user.userId, email: user.email },
    });
  } catch (error) {
    console.error("❌ [REGISTER ERROR]:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

// 🔐 Đăng nhập
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("📩 [LOGIN] Email:", email);
  console.log("🔑 [LOGIN] Mật khẩu nhập vào:", password);

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ [LOGIN FAILED] Không tìm thấy user!");
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log("❌ [LOGIN FAILED] Mật khẩu không khớp!");
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Tạo token chứa userId
    const token = jwt.sign(
      { userId: user.userId, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ [LOGIN SUCCESS] Token:", token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { userId: user.userId, email: user.email },
    });
  } catch (error) {
    console.error("❌ [LOGIN ERROR]:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

module.exports = router;
