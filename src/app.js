const express = require('express');
const { listRecipients } = require('./services/recipientService');
const { sendCampaign } = require('./services/smsService');
const app = express();
app.use(express.json({ limit: '32kb' }));
app.get('/api/recipients', (_req, res) => res.json(listRecipients()));
app.post('/api/send-campaign', async (req, res) => {
  if (process.env.CAMPAIGN_API_KEY && req.get('x-api-key') !== process.env.CAMPAIGN_API_KEY) {
    return res.status(401).json({ error: 'Invalid campaign API key.' });
  }
  const { message, recipientIds } = req.body || {};
  if (typeof message !== 'string' || !message.trim()) return res.status(400).json({ error: 'message is required.' });
  if (message.length > 918) return res.status(400).json({ error: 'message is too long.' });
  const allRecipients = listRecipients();
  const recipients = Array.isArray(recipientIds) && recipientIds.length
    ? allRecipients.filter(recipient => recipientIds.includes(recipient.id))
    : allRecipients;
  if (!recipients.length) return res.status(400).json({ error: 'No matching recipients.' });
  const result = await sendCampaign({ message: message.trim(), recipients });
  const failed = result.results.filter(item => item.status === 'failed').length;
  return res.status(failed === result.results.length ? 502 : 200).json(result);
});
app.use((_req, res) => res.status(404).json({ error: 'Endpoint not found' }));
module.exports = app;
