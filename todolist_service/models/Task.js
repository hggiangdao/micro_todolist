const mongoose = require("mongoose");


const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    deadline: { type: Date },
    completed: { type: Boolean, default: false },
    userId: { 
      type: String,  // Chỉ lưu dưới dạng String thay vì ObjectId và không cần kiểm tra
      required: true,  // Mỗi task vẫn cần có userId
    },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

module.exports = mongoose.model("Task", taskSchema);
