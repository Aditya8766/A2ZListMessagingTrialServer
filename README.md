# Recipient API

This backend has one job. It returns three dummy recipients for local Android testing. The phone sends SMS directly through its SIM. This server does not send SMS and does not store messages.

## Start

```powershell
Set-Location C:\Projects\A2ZInternalMessagingApp\sms-gateway-server
npm.cmd install
npm.cmd start
```

The API listens on `http://0.0.0.0:5000`.

## Endpoint

`GET /api/recipients`

```json
[
  { "id": 1, "name": "Test User 01", "phoneNumber": "9404889632" },
  { "id": 2, "name": "Test User 02", "phoneNumber": "8698534130" },
  { "id": 3, "name": "Test User 03", "phoneNumber": "7875136980" }
]
```

Keep the phone and computer on the same Wi-Fi. Set the computer's Wi-Fi address in `mobile/src/config/api.ts`. Android cleartext LAN access is enabled in `mobile/app.json` for this local test.
"# A2ZListMessagingTrialServer" 
"# A2ZListMessagingTrialServer" 
"# A2ZListMessagingTrialServer" 
