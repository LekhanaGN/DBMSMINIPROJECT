const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all visits for a patient
router.get('/:patientId', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT v.*, d.name AS doctor_name FROM visits v
       LEFT JOIN doctors d ON v.doctor_id = d.id
       WHERE v.patient_id = ? ORDER BY v.visit_date DESC`,
      [req.params.patientId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add visit
router.post('/', async (req, res) => {
  try {
    const { patient_id, doctor_id, visit_date, reason, diagnosis, prescription, follow_up_date, notes } = req.body;
    if (!patient_id || !visit_date) return res.status(400).json({ success: false, message: 'patient_id and visit_date are required' });
    const [result] = await db.execute(
      'INSERT INTO visits (patient_id, doctor_id, visit_date, reason, diagnosis, prescription, follow_up_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [patient_id, doctor_id || null, visit_date, reason, diagnosis, prescription, follow_up_date || null, notes]
    );
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE a visit
router.delete('/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM visits WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Visit deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
