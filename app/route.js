const express = require('express');
const router = express.Router();
const { pool } = require('./db');
const { httpRequestDurationMicroseconds, expenseCreatedCounter } = require('./metrics');

function timingMiddleware(req, res, next) {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route ? req.route.path : req.path, code: res.statusCode });
  });
  next();
}

router.use(timingMiddleware);

router.post('/expenses', async (req, res) => {
  const { amount, category, note } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO expenses (amount, category, note) VALUES ($1, $2, $3) RETURNING *',
      [amount, category, note]
    );
    expenseCreatedCounter.inc();
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

router.get('/expenses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses ORDER BY created_at DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

router.get('/report', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT category, SUM(amount) as total, COUNT(*) as count
      FROM expenses
      GROUP BY category
      ORDER BY total DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

module.exports = router;
