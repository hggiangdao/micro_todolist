const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;

// ===== LOGIN =====
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const response = await axios.post("http://localhost:5001/api/auth/login", {
      email,
      password,
    });
    res.json(response.data);
  } catch (error) {
    console.error("Lỗi kết nối tới Auth Service:", error.message);
    res.status(500).json({ message: "Lỗi kết nối Auth Service" });
  }
});

// ===== REGISTER =====
app.post("/auth/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name)
    return res.status(400).json({ message: "Email, name và password là bắt buộc" });

  try {
    const response = await axios.post("http://localhost:5001/api/auth/register", {
      email,
      password,
      name,
    });
    res.json(response.data);
  } catch (error) {
    console.error("Lỗi kết nối tới Auth Service:", error.message);
    res.status(500).json({ message: "Lỗi kết nối Auth Service" });
  }
});

// ===== TASK SERVICE =====
// Lấy danh sách task (GET)
app.get("/tasks", async (req, res) => {
  try {
    const { userId } = req.query; // Lấy userId từ request của client gửi lên

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Gọi tới todo_service kèm theo userId
    const response = await axios.get("http://localhost:5002/api/tasks", {
      params: { userId },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Lỗi kết nối Task Service:", error.message);
    res.status(500).json({ message: "Lỗi kết nối Task Service" });
  }
});

// Thêm task mới (POST)
app.post("/tasks", async (req, res) => {
  const { title, description, userId } = req.body;

  try {
    const response = await axios.post("http://localhost:5002/api/tasks", {
      title,
      description,
      userId,
    });
    res.json(response.data);
  } catch (error) {
    console.error("Lỗi thêm task:", error.message);
    res.status(500).json({ message: "Không thể thêm task" });
  }
});

// Update task (PUT)
app.put("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const updatedData = req.body;

  try {
    const response = await axios.put(`http://localhost:5002/api/tasks/${taskId}`, updatedData);
    res.json(response.data);
  } catch (error) {
    console.error("Lỗi cập nhật task:", error.message);
    res.status(500).json({ message: "Không thể cập nhật task" });
  }
});

// Delete task (DELETE)
app.delete("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    const response = await axios.delete(`http://localhost:5002/api/tasks/${taskId}`);
    res.json(response.data);
  } catch (error) {
    console.error("Lỗi xoá task:", error.message);
    res.status(500).json({ message: "Không thể xoá task" });
  }
});

// ===== SERVER LISTEN =====
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running at http://localhost:${PORT}`);
});
