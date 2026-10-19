const { query, run } = require('../config/db');

exports.getAllPatients = async (req, res) => {
  try {
    const rows = await query('SELECT * FROM patients ORDER BY id DESC');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addPatient = async (req, res) => {
  const { full_name, age, gender, phone, blood_group, address } = req.body;
  if (!full_name || !age || !gender || !phone) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  try {
    const result = await run(
      'INSERT INTO patients (full_name, age, gender, phone, blood_group, address) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, age, gender, phone, blood_group || null, address || null]
    );
    res.status(201).json({ success: true, message: 'Patient added successfully', patientId: result.lastID });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    await run('DELETE FROM patients WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};