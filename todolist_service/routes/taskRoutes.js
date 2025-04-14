const express = require("express");
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");
const Task = require("../models/Task");  // Đảm bảo bạn import đúng model Task

const router = express.Router();

// Route lấy tất cả task với phân trang

// Route lấy tất cả task của user theo userId với phân trang
router.get("/", async (req, res) => {
    const { userId } = req.query;  // Lấy userId từ query parameters
    
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
  
    try {
      // Tìm tất cả các task của userId
      const tasks = await Task.find({ userId: userId });
      
      if (tasks.length === 0) {
        return res.status(404).json({ message: "No tasks found for this userId" });
      }
      
      return res.status(200).json(tasks);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
  
  // Route tạo task mới
  router.post("/", async (req, res) => {
    const { title, description, category, deadline, userId } = req.body;
    
    try {
      const newTask = new Task({ title, description, category, deadline, userId });
      await newTask.save();
      return res.status(201).json(newTask);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });
  
// Route tạo task mới
router.post("/", createTask);

// Route cập nhật task theo ID
router.put("/:id", updateTask);

// Route xóa task theo ID
router.delete("/:id", deleteTask);

module.exports = router;
