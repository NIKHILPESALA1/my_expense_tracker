const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function init() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        description TEXT NOT NULL,
        amount NUMERIC(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ Failed to init DB', err);
    throw err;
  }
}

module.exports = { pool, init };
