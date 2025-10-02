const express = require('express');
const router = express.Router();

// Example GET
router.get('/', (req, res) => {
  res.json({ message: 'Expenses API working!' });
});

// Example POST
router.post('/', (req, res) => {
  const expense = req.body;
  // save expense to DB (todo)
  res.status(201).json({ success: true, expense });
});

module.exports = router;
