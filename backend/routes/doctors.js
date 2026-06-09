const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM doctors ORDER BY name ASC');
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { name, specialization, phone } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const [result] = await db.execute('INSERT INTO doctors (name, specialization, phone) VALUES (?, ?, ?)', [name, specialization, phone]);
    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM doctors WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Doctor deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
