const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    completed: { type: Boolean, default: false },
    userId: { // Thêm trường userId để liên kết với người dùng
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Liên kết với model User (User Service)
      required: true,  // Mỗi task cần có một userId
    },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

module.exports = mongoose.model("Task", taskSchema);
