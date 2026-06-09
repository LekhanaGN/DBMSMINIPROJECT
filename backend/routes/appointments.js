const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT a.*, p.name AS patient_name, p.village, p.phone AS patient_phone,
             d.name AS doctor_name, d.specialization
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date ASC, a.appointment_time ASC`);
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time, reason, notes } = req.body;
    if (!patient_id || !appointment_date) return res.status(400).json({ success: false, message: 'patient_id and date required' });
    const [result] = await db.execute(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [patient_id, doctor_id || null, appointment_date, appointment_time || null, reason, notes]
    );
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Updated' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM appointments WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
