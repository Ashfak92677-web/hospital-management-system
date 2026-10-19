const { query, run, get } = require('../config/db');

exports.getAllAppointments = async (req, res) => {
  try {
    const sql = `
      SELECT 
        a.id,
        a.appointment_date,
        a.time_slot,
        a.status,
        a.notes,
        p.full_name AS patient_name,
        p.phone AS patient_phone,
        d.name AS doctor_name,
        d.specialization AS doctor_specialization
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date DESC, a.id DESC
    `;
    const rows = await query(sql);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bookAppointment = async (req, res) => {
  const { patient_id, doctor_id, appointment_date, time_slot, notes } = req.body;
  if (!patient_id || !doctor_id || !appointment_date || !time_slot) {
    return res.status(400).json({ success: false, message: 'Please provide all appointment details' });
  }

  try {
    const result = await run(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, time_slot, notes) VALUES (?, ?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_date, time_slot, notes || '']
    );
    res.status(201).json({ success: true, message: 'Appointment booked successfully', appointmentId: result.lastID });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await run('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    res.status(200).json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const pCount = await get('SELECT COUNT(*) AS total_patients FROM patients');
    const dCount = await get('SELECT COUNT(*) AS total_doctors FROM doctors');
    const aCount = await get('SELECT COUNT(*) AS total_appointments FROM appointments');
    const pendingCount = await get("SELECT COUNT(*) AS pending_appointments FROM appointments WHERE status = 'Scheduled'");

    res.status(200).json({
      success: true,
      stats: {
        total_patients: pCount.total_patients,
        total_doctors: dCount.total_doctors,
        total_appointments: aCount.total_appointments,
        pending_appointments: pendingCount.pending_appointments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};