const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// --- CREATE ---
router.post('/', async (req, res) => {
  try {
    const { description, amount } = req.body;
    if (!description || !amount) {
      return res.status(400).json({ error: 'description and amount are required' });
    }

    const result = await pool.query(
      'INSERT INTO expenses (description, amount) VALUES ($1, $2) RETURNING *',
      [description, amount]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// --- READ ALL ---
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// --- READ ONE ---
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM expenses WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching expense:', err);
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
});

// --- UPDATE ---
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount } = req.body;

    const result = await pool.query(
      'UPDATE expenses SET description = $1, amount = $2 WHERE id = $3 RETURNING *',
      [description, amount, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// --- DELETE ---
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully', deleted: result.rows[0] });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

module.exports = router;
