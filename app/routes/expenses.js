// app/routes/expenses.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Expenses API is working');
});

module.exports = router;
