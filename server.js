const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT || 5000);
const server = require('node:http').createServer(require('./src/app'));
server.listen(port, host, () => console.log(`Recipient API listening on http://${host}:${port}`));
