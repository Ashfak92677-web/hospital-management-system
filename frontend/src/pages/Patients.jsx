import React, { useState, useEffect } from 'react';
import API from '../api';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    gender: 'Male',
    phone: '',
    blood_group: 'A+',
    address: '',
  });

  const loadPatients = async () => {
    try {
      const res = await API.get('/patients');
      if (res.data.success) setPatients(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/patients', form);
      setForm({ full_name: '', age: '', gender: 'Male', phone: '', blood_group: 'A+', address: '' });
      loadPatients();
    } catch (err) {
      alert('Error registering patient');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this patient record?')) {
      await API.delete(`/patients/${id}`);
      loadPatients();
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Patient Management</h1>
      </div>

      <div className="content-box">
        <h2>Register New Patient</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                required
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="e.g. 28"
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10-digit phone"
              />
            </div>
            <div className="form-group">
              <label>Blood Group</label>
              <select value={form.blood_group} onChange={(e) => setForm({ ...form, blood_group: e.target.value })}>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div className="form-group">
              <label>City / Address</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="e.g. New Delhi"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary">+ Register Patient</button>
        </form>
      </div>

      <div className="content-box">
        <h2>Registered Patients ({patients.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age/Gender</th>
                <th>Phone</th>
                <th>Blood</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td style={{ fontWeight: 600 }}>{p.full_name}</td>
                  <td>{p.age} yrs / {p.gender}</td>
                  <td>{p.phone}</td>
                  <td><strong>{p.blood_group || '-'}</strong></td>
                  <td>{p.address || '-'}</td>
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {patients.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
                    No patients registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Patients;