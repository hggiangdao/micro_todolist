const Task = require("../models/Task");
const fs = require("fs");
const mongoose = require("mongoose");  // Thêm dòng này
const { ObjectId } = require("mongoose").Types;



// Hàm ghi log vào file
const logRequest = (message) => {
  fs.appendFileSync("logs/requests.log", `${new Date().toISOString()} - ${message}\n`);
};
// Lấy danh sách tất cả các tasks của một user
const getTasks = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const tasks = await Task.find({ userId: new ObjectId(userId) }).exec();

    return res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};





// Tạo Task mới
// Tạo Task mới
exports.createTask = async (req, res) => {
  const { title, description, category, deadline, userId } = req.body;

  if (!title || !description || !userId) {
    return res.status(400).json({ success: false, message: "Title, Description và UserId là bắt buộc" });
  }

  try {
    const task = new Task({
      title,
      description,
      category,
      deadline,
      userId,  // Không cần kiểm tra với bảng User
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: "Task created!",
      task,
    });
  } catch (error) {
    console.error(error); // In lỗi chi tiết ra console để debug
    res.status(500).json({ success: false, message: "Lỗi khi tạo task" });
  }
};


// Cập nhật Task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, deadline } = req.body; // 👈 Thêm deadline

  logRequest(`[PUT] /api/tasks/${id} - Updating Task`);

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Không tìm thấy Task" });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Không có quyền sửa task này" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.category = category || task.category;
    task.deadline = deadline || task.deadline; // 👈 Cập nhật deadline nếu có

    await task.save();

    res.json({
      success: true,
      message: "Task cập nhật thành công",
      task,
    });
  } catch (error) {
    logRequest(`[ERROR] /api/tasks/${id} - ${error.message} - Stack: ${error.stack}`);
    res.status(500).json({ success: false, message: "Lỗi khi cập nhật task" });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params; // Lấy ID của task từ URL

  try {
    // Tìm và xóa task theo ID
    const task = await Task.findByIdAndDelete(id);

    // Nếu không tìm thấy task
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Trả về kết quả thành công
    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(`[ERROR] ${error.message}`);
    res.status(500).json({ success: false, message: "Error deleting task" });
  }
};
