const recipients = [
  { id: 1, name: 'Test User 01', phoneNumber: '' },
  { id: 2, name: 'Test User 02', phoneNumber: '' },
  { id: 3, name: 'Test User 03', phoneNumber: '' },
  { id: 4, name: 'Test User 04', phoneNumber: '' },
];

function listRecipients() {
  return recipients;
}

module.exports = { listRecipients };
