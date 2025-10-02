const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@postgres:5432/expenses'
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      amount NUMERIC NOT NULL,
      category TEXT,
      note TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

module.exports = { pool, init };
