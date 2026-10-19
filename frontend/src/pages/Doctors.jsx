import React, { useState, useEffect } from 'react';
import API from '../api';
import { UserPlus, ShieldAlert, Award, Calendar, DollarSign, Phone } from 'lucide-react';

const Doctors = ({ user }) => {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    name: '',
    specialization: 'General Physician',
    phone: '',
    available_days: 'Mon - Sat (09:00 AM - 02:00 PM)',
    consulting_fee: '500',
  });

  const isAdmin = user?.role === 'admin';

  const loadDoctors = async () => {
    try {
      const res = await API.get('/doctors');
      if (res.data.success) setDoctors(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/doctors', form);
      setForm({
        name: '',
        specialization: 'General Physician',
        phone: '',
        available_days: 'Mon - Sat (09:00 AM - 02:00 PM)',
        consulting_fee: '500',
      });
      loadDoctors();
      alert('Doctor added successfully!');
    } catch (err) {
      alert('Error adding doctor');
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Doctor Management</h1>
      </div>

      {/* Admin Only Onboarding Form */}
      {isAdmin ? (
        <div className="content-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <UserPlus size={20} color="#0284c7" />
            <h2 style={{ margin: 0 }}>Add Specialist Doctor (Admin Privilege)</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Doctor Full Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Sharma"
                />
              </div>

              <div className="form-group">
                <label>Specialization Department</label>
                <select
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                >
                  <option value="General Physician">General Physician (General OPD)</option>
                  <option value="Cardiologist">Cardiologist (Heart Specialist)</option>
                  <option value="Orthopedic">Orthopedic (Bone & Joint)</option>
                  <option value="Pediatrician">Pediatrician (Child Specialist)</option>
                  <option value="Neurologist">Neurologist (Brain & Nerve)</option>
                  <option value="Dermatologist">Dermatologist (Skin & Hair)</option>
                  <option value="ENT Specialist">ENT Specialist (Ear, Nose, Throat)</option>
                  <option value="Gynecologist">Gynecologist (Women Health)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit mobile"
                />
              </div>

              <div className="form-group">
                <label>Schedule & Available Days</label>
                <select
                  value={form.available_days}
                  onChange={(e) => setForm({ ...form, available_days: e.target.value })}
                >
                  <option value="Mon - Sat (09:00 AM - 02:00 PM)">Mon - Sat (Morning: 09:00 AM - 02:00 PM)</option>
                  <option value="Mon - Sat (04:00 PM - 08:00 PM)">Mon - Sat (Evening: 04:00 PM - 08:00 PM)</option>
                  <option value="Mon, Wed, Fri (10:00 AM - 01:00 PM)">Mon, Wed, Fri (10:00 AM - 01:00 PM)</option>
                  <option value="Tue, Thu, Sat (02:00 PM - 06:00 PM)">Tue, Thu, Sat (02:00 PM - 06:00 PM)</option>
                  <option value="Weekends (Sat - Sun)">Weekends Only (Sat - Sun)</option>
                  <option value="Daily 24x7 (Emergency On-Call)">Daily 24x7 (Emergency On-Call)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Consultation Fee Bracket</label>
                <select
                  value={form.consulting_fee}
                  onChange={(e) => setForm({ ...form, consulting_fee: e.target.value })}
                >
                  <option value="300">₹300 - Standard General OPD</option>
                  <option value="500">₹500 - Senior Medical Officer</option>
                  <option value="700">₹700 - Specialist Consultant</option>
                  <option value="1000">₹1000 - Super Specialist (MD/DM)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary">+ Register Doctor</button>
          </form>
        </div>
      ) : (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldAlert size={24} color="#0284c7" />
          <div>
            <strong style={{ color: '#0f172a' }}>Receptionist View:</strong> Doctor directory is read-only. Only Administrator accounts can recruit or modify physician credentials.
          </div>
        </div>
      )}

      {/* Directory Table */}
      <div className="content-box">
        <h2>Doctor Directory ({doctors.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Shift / Schedule</th>
                <th>Consulting Fee</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{d.name}</td>
                  <td>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                      {d.specialization}
                    </span>
                  </td>
                  <td>{d.available_days}</td>
                  <td><strong>₹{d.consulting_fee}</strong></td>
                  <td>{d.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Doctors;