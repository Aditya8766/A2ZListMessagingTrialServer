const crypto = require('node:crypto');

const provider = (process.env.SMS_PROVIDER || 'mock').toLowerCase();

function renderMessage(template, recipient) {
  return template.replace(/\{\{\s*(id|name|phoneNumber)\s*\}\}/gi, (_match, key) => String(recipient[key] ?? ''));
}

function toInternationalNumber(phoneNumber) {
  const digits = String(phoneNumber).replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return digits;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

async function sendWithMsg91(phoneNumber, message) {
  const authKey = process.env.MSG91_AUTH_KEY;
  const flowId = process.env.MSG91_FLOW_ID;
  if (!authKey) throw new Error('MSG91_AUTH_KEY is required when SMS_PROVIDER=msg91.');

  // Preferred India integration: an approved MSG91 Flow/DLT template with a
  // variable (usually VAR1) containing the rendered backend message.
  if (flowId) {
    const variable = process.env.MSG91_MESSAGE_VARIABLE || 'VAR1';
    const response = await fetch('https://control.msg91.com/api/v5/flow', {
      method: 'POST',
      headers: { authkey: authKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template_id: flowId,
        recipients: [{ mobiles: toInternationalNumber(phoneNumber), [variable]: message }],
      }),
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = null; }
    if (!response.ok) throw new Error(`MSG91 HTTP ${response.status}: ${text.slice(0, 300)}`);
    if (data?.type?.toLowerCase() === 'error' || data?.message?.toLowerCase?.() === 'error') {
      throw new Error(data.message || 'MSG91 rejected the message.');
    }
    const transactionId = data?.request_id || data?.requestId || data?.message || text.trim();
    if (!transactionId) throw new Error('MSG91 returned an empty response.');
    return String(transactionId);
  }

  const senderId = process.env.MSG91_SENDER_ID;
  if (!senderId) throw new Error('Set MSG91_FLOW_ID (recommended) or MSG91_SENDER_ID when SMS_PROVIDER=msg91.');
  const body = new URLSearchParams({
    authkey: authKey,
    mobiles: toInternationalNumber(phoneNumber),
    message,
    sender: senderId,
    route: process.env.MSG91_ROUTE || '1',
    country: process.env.MSG91_COUNTRY || '91',
  });
  const response = await fetch('https://api.msg91.com/api/v2/sendsms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { data = null; }
  if (!response.ok) throw new Error(`MSG91 HTTP ${response.status}: ${text.slice(0, 300)}`);
  if (data?.type?.toLowerCase() === 'error') throw new Error(data.message || 'MSG91 rejected the message.');
  const transactionId = data?.request_id || data?.requestId || data?.message || text.trim();
  if (!transactionId) throw new Error('MSG91 returned an empty response.');
  return String(transactionId);
}

async function sendCampaign({ message, recipients }) {
  const campaignId = `campaign-${crypto.randomUUID()}`;
  const results = [];
  for (const recipient of recipients) {
    const renderedMessage = renderMessage(message, recipient);
    try {
      let transactionId;
      if (provider === 'mock') transactionId = `mock-${crypto.randomUUID()}`;
      else if (provider === 'msg91') transactionId = await sendWithMsg91(recipient.phoneNumber, renderedMessage);
      else throw new Error(`Unsupported SMS_PROVIDER: ${provider}`);
      results.push({ recipientId: recipient.id, name: recipient.name, phoneNumber: recipient.phoneNumber, message: renderedMessage, status: provider === 'mock' ? 'mocked' : 'submitted', transactionId });
    } catch (error) {
      results.push({ recipientId: recipient.id, name: recipient.name, phoneNumber: recipient.phoneNumber, message: renderedMessage, status: 'failed', error: error instanceof Error ? error.message : String(error) });
    }
  }
  return { campaignId, provider, dryRun: provider === 'mock', results };
}

module.exports = { sendCampaign };
