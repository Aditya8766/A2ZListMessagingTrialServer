const recipients = [
  { id: 1, name: 'Test User 01', phoneNumber: '9404889632' },
  { id: 2, name: 'Test User 02', phoneNumber: '8698534130' },
  { id: 3, name: 'Test User 03', phoneNumber: '7875136980' },
  { id: 4, name: 'Test User 04', phoneNumber: '8766971902' },
];

function listRecipients() {
  return recipients;
}

module.exports = { listRecipients };
