const express = require('express');
const bodyParser = require('body-parser');
const expensesRoutes = require('./routes/expenses');  // ✅ point to expenses.js
const { register } = require('./metrics');
const { init } = require('./db');

const app = express();
app.use(bodyParser.json());

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// API
app.use('/expenses', expensesRoutes);  // ✅ mount under /expenses

// start server after DB initialized
const port = process.env.PORT || 8080;
init().then(() => {
  app.listen(port, () => console.log(`Expense app listening on ${port}`));
}).catch(err => {
  console.error('Failed to init DB', err);
  process.exit(1);
});
