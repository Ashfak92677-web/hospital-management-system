import React, { useState, useEffect } from 'react';
import API from '../api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    time_slot: '10:00 AM - 10:30 AM',
    notes: '',
  });

  const loadData = async () => {
    try {
      const [appRes, patRes, docRes] = await Promise.all([
        API.get('/appointments'),
        API.get('/patients'),
        API.get('/doctors'),
      ]);
      if (appRes.data.success) setAppointments(appRes.data.data);
      if (patRes.data.success) setPatients(patRes.data.data);
      if (docRes.data.success) setDoctors(docRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patient_id || !form.doctor_id) {
      return alert('Please select both a patient and a doctor');
    }

    try {
      await API.post('/appointments', form);
      setForm({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        time_slot: '10:00 AM - 10:30 AM',
        notes: '',
      });
      loadData();
    } catch (err) {
      alert('Error scheduling appointment');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, { status });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Appointment Scheduling</h1>
      </div>

      <div className="content-box">
        <h2>Book New Consultation</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Patient</label>
              <select
                required
                value={form.patient_id}
                onChange={(e) => setForm({ ...form, patient_id: e.target.value })}
              >
                <option value="">-- Choose Patient --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} (Phone: {p.phone})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Doctor</label>
              <select
                required
                value={form.doctor_id}
                onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
              >
                <option value="">-- Choose Doctor --</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                required
                value={form.appointment_date}
                onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Time Slot</label>
              <select
                value={form.time_slot}
                onChange={(e) => setForm({ ...form, time_slot: e.target.value })}
              >
                <option value="09:00 AM - 09:30 AM">09:00 AM - 09:30 AM</option>
                <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
                <option value="04:00 PM - 04:30 PM">04:00 PM - 04:30 PM</option>
              </select>
            </div>

            <div className="form-group">
              <label>Symptoms / Notes</label>
              <input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="e.g. Regular Checkup / Chest Pain"
              />
            </div>
          </div>
          <button type="submit" className="btn-primary">Confirm Appointment</button>
        </form>
      </div>

      <div className="content-box">
        <h2>Scheduled Appointments ({appointments.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date & Slot</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>
                    <strong>{a.appointment_date}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{a.time_slot}</div>
                  </td>
                  <td>
                    <div>{a.patient_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{a.patient_phone}</div>
                  </td>
                  <td>
                    <div>{a.doctor_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#0284c7' }}>{a.doctor_specialization}</div>
                  </td>
                  <td>{a.notes || '—'}</td>
                  <td>
                    <span className={`badge badge-${a.status.toLowerCase()}`}>
                      {a.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
                    No appointments booked yet.
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

export default Appointments;