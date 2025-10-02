const client = require('prom-client');

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const register = client.register;

// Custom counters/histograms
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5]
});

const expenseCreatedCounter = new client.Counter({
  name: 'expenses_created_total',
  help: 'Total number of expenses created'
});

module.exports = { register, httpRequestDurationMicroseconds, expenseCreatedCounter };
