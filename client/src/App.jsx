import { useState, useEffect } from 'react';

// Tự động dùng VITE_API_URL hoặc mặc định trỏ thẳng tới Backend Render chuẩn mới
const BASE_URL = import.meta.env.VITE_API_URL || 'https://mern-backend-235749.onrender.com';
const API_URL = BASE_URL.endsWith('/api/students') ? BASE_URL : `${BASE_URL.replace(/\/$/, '')}/api/students`;

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  // 1. Lấy danh sách sinh viên từ Backend
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sinh viên:', error);
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. Cập nhật dữ liệu Form khi người dùng nhập
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Xử lý Thêm mới hoặc Cập nhật sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        setEditingId(null);
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setFormData({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };

  // 4. Đưa thông tin sinh viên vào Form để sửa
  const handleEdit = (student) => {
    setEditingId(student._id);
    setFormData({
      studentId: student.studentId || '',
      name: student.name || '',
      email: student.email || '',
    });
  };

  // 5. Hủy chế độ sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ studentId: '', name: '', email: '' });
  };

  // 6. Gọi API DELETE để xóa sinh viên
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này không?')) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchStudents();
      } catch (error) {
        console.error('Lỗi khi xóa sinh viên:', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Quản lý sinh viên</h2>

      {/* Form nhập dữ liệu */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          name="studentId"
          placeholder="MSSV"
          value={formData.studentId}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button type="submit" style={{ cursor: 'pointer' }}>
          {editingId ? 'Cập nhật' : 'Thêm sinh viên'}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit} style={{ cursor: 'pointer' }}>
            Hủy
          </button>
        )}
      </form>

      {/* Danh sách sinh viên kèm nút Sửa và Xóa */}
      <h3>Danh sách sinh viên</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students.map((st) => (
          <li
            key={st._id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid #444',
            }}
          >
            <span>
              <strong>{st.studentId}</strong> - {st.name} ({st.email})
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => handleEdit(st)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#e0a800',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(st._id)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;