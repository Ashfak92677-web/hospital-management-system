const { query, run } = require('../config/db');

exports.getAllDoctors = async (req, res) => {
  try {
    const rows = await query('SELECT * FROM doctors ORDER BY id ASC');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addDoctor = async (req, res) => {
  const { name, specialization, phone, available_days, consulting_fee } = req.body;
  if (!name || !specialization || !phone) {
    return res.status(400).json({ success: false, message: 'Please provide required doctor details' });
  }

  try {
    const result = await run(
      'INSERT INTO doctors (name, specialization, phone, available_days, consulting_fee) VALUES (?, ?, ?, ?, ?)',
      [name, specialization, phone, available_days || 'Mon - Sat', consulting_fee || 500.00]
    );
    res.status(201).json({ success: true, message: 'Doctor added successfully', doctorId: result.lastID });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};