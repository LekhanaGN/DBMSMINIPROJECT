const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET medical history for patient
router.get('/:patientId', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM medical_history WHERE patient_id = ? ORDER BY recorded_at DESC',
      [req.params.patientId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add or update history record
router.post('/', async (req, res) => {
  try {
    const { patient_id, condition_name, allergies, current_medications, notes } = req.body;
    if (!patient_id) return res.status(400).json({ success: false, message: 'patient_id is required' });
    const [result] = await db.execute(
      'INSERT INTO medical_history (patient_id, condition_name, allergies, current_medications, notes) VALUES (?, ?, ?, ?, ?)',
      [patient_id, condition_name, allergies, current_medications, notes]
    );
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE a history record
router.delete('/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM medical_history WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
