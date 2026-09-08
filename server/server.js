require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Sửa đường dẫn import từ ../models/Student thành ./models/Student
const Student = require('./models/Student');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Bổ sung API /api/hello phục vụ cho Câu 45
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from MERN Backend!' });
});

// Kết nối MongoDB (sử dụng biến môi trường hoặc fallback mặc định)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cloud-lab';
mongoose.connect(mongoURI)
  .then(() => console.log('Da ket noi thanh cong voi MongoDB!'))
  .catch((err) => console.error('Loi ket noi MongoDB:', err));

// Câu 36: Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Câu 37 & 41: Thêm sinh viên mới
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Câu 38: Cập nhật sinh viên
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Câu 39: Xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa sinh viên thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server dang chay tai port ${port}`);
});