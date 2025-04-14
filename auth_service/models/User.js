const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid"); // ✅ import uuid

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: uuidv4, // ✅ tạo tự động khi user mới
    unique: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash mật khẩu trước khi lưu vào DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// So sánh mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
