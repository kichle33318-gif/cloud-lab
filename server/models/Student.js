const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true }
}, { timestamps: true });

// Dòng này rất quan trọng để biến file này thành Model
module.exports = mongoose.model('Student', studentSchema);