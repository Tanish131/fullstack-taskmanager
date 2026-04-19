const express = require('express');
const client = require('prom-client');

const router = express.Router();
client.collectDefaultMetrics({ prefix: 'taskmanager_' });

router.get('/', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = router;
