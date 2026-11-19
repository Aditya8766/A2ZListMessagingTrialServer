const express = require('express');
const { listRecipients } = require('./services/recipientService');
const app = express();
app.get('/api/recipients', (_req, res) => res.json(listRecipients()));
app.use((_req, res) => res.status(404).json({ error: 'Endpoint not found' }));
module.exports = app;
