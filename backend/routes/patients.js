const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all patients (with optional search)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM patients';
    let params = [];
    if (search) {
      query += ' WHERE name LIKE ? OR village LIKE ? OR phone LIKE ?';
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await db.execute(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single patient
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM patients WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create patient
router.post('/', async (req, res) => {
  try {
    const { name, dob, gender, blood_type, phone, village, district, emergency_contact, emergency_phone } = req.body;
    if (!name || !dob || !gender) return res.status(400).json({ success: false, message: 'Name, DOB and gender are required' });
    const [result] = await db.execute(
      'INSERT INTO patients (name, dob, gender, blood_type, phone, village, district, emergency_contact, emergency_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, dob, gender, blood_type, phone, village, district, emergency_contact, emergency_phone]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, ...req.body } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update patient
router.put('/:id', async (req, res) => {
  try {
    const { name, dob, gender, blood_type, phone, village, district, emergency_contact, emergency_phone } = req.body;
    await db.execute(
      'UPDATE patients SET name=?, dob=?, gender=?, blood_type=?, phone=?, village=?, district=?, emergency_contact=?, emergency_phone=? WHERE id=?',
      [name, dob, gender, blood_type, phone, village, district, emergency_contact, emergency_phone, req.params.id]
    );
    res.json({ success: true, message: 'Patient updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE patient
router.delete('/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM patients WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
