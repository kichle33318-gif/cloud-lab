import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/students`);
      if (!res.ok) throw new Error('Không thể kết nối Backend');
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error('Lỗi tải danh sách:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setForm({ studentId: '', name: '', email: '' });
        fetchStudents();
      } else {
        const errData = await res.json();
        alert(`Lỗi: ${errData.message}`);
      }
    } catch (error) {
      console.error('Lỗi thêm sinh viên:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Quản lý sinh viên</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          placeholder="MSSV"
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          required
        />
        <input
          placeholder="Họ tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button type="submit">Thêm sinh viên</button>
      </form>

      <h3>Danh sách sinh viên</h3>
      <ul>
        {students.map((s) => (
          <li key={s._id}>{s.studentId} - {s.name} ({s.email})</li>
        ))}
      </ul>
    </div>
  );
}

export default App;