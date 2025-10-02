const { Pool } = require('pg');

// Use DATABASE_URL if available, else fallback
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/expenses',
});

// Simple init to test DB
async function init() {
  try {
    await pool.query('SELECT NOW()'); // test connection
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Failed to connect to DB:', err);
    throw err;
  }
}

module.exports = { pool, init };
