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

// Route Health Check cho Render
app.get('/', (req, res) => {
  res.send(`Backend Running. DB Connection State: ${mongoose.connection.readyState}`);
});

// Bổ sung API /api/hello phục vụ cho Câu 45
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from MERN Backend!' });
});

// Kết nối MongoDB (sử dụng biến môi trường hoặc fallback mặc định)
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cloud-lab';

mongoose.connect(mongoURI, { 
  family: 4,                      // Ép dùng IPv4 tránh đứt mạng ngầm trên Render
  serverSelectionTimeoutMS: 5000  // Giới hạn chờ kết nối 5 giây
})
  .then(() => console.log('Da ket noi thanh cong voi MongoDB!'))
  .catch((err) => console.error('Loi ket noi MongoDB:', err));

// Lắng nghe sự kiện đứt kết nối ngầm
mongoose.connection.on('disconnected', () => console.log('>>> MongoDB bi ngat ket noi!'));
mongoose.connection.on('error', (err) => console.error('>>> Loi Mongoose:', err));

// Câu 36: Lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
  try {
    // Nếu DB chưa sẵn sàng (readyState !== 1), phản hồi ngay thay vì để Mongoose treo 10s
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database chua san sang hoặc dang ngat ket noi!', 
        readyState: mongoose.connection.readyState 
      });
    }

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