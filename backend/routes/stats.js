const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [[{ total_patients }]] = await db.execute('SELECT COUNT(*) AS total_patients FROM patients');
    const [[{ total_visits }]] = await db.execute('SELECT COUNT(*) AS total_visits FROM visits');
    const [[{ visits_today }]] = await db.execute("SELECT COUNT(*) AS visits_today FROM visits WHERE visit_date = CURDATE()");
    const [[{ this_month }]] = await db.execute("SELECT COUNT(*) AS this_month FROM visits WHERE MONTH(visit_date) = MONTH(CURDATE()) AND YEAR(visit_date) = YEAR(CURDATE())");
    const [gender_dist] = await db.execute('SELECT gender, COUNT(*) AS count FROM patients GROUP BY gender');
    const [recent_visits] = await db.execute(
      `SELECT v.visit_date, v.reason, p.name AS patient_name, p.village
       FROM visits v JOIN patients p ON v.patient_id = p.id
       ORDER BY v.created_at DESC LIMIT 5`
    );
    res.json({
      success: true,
      data: { total_patients, total_visits, visits_today, this_month, gender_dist, recent_visits }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
