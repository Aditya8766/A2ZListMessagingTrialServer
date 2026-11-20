# SMS Gateway Server

This backend returns the test recipients and can render/send backend campaigns. It defaults to a safe mock provider, so local tests never send paid SMS accidentally.

## Start

```powershell
Set-Location C:\Projects\A2ZInternalMessagingApp\sms-gateway-server
npm.cmd install
npm.cmd start
```

The API listens on `http://0.0.0.0:5000`.

## Endpoints

`GET /api/recipients`

```json
[
  { "id": 1, "name": "Test User 01", "phoneNumber": "9404889632" },
  { "id": 2, "name": "Test User 02", "phoneNumber": "8698534130" },
  { "id": 3, "name": "Test User 03", "phoneNumber": "7875136980" }
]
```

### Send a backend campaign

```http
POST /api/send-campaign
Content-Type: application/json
```

```json
{ "message": "Hello {{name}}, your offer is ready." }
```

The server renders `{{name}}`, `{{id}}`, and `{{phoneNumber}}` separately for every recipient and returns a transaction ID for each result. Add `recipientIds` to target selected IDs.

For a shared or deployed server, set `CAMPAIGN_API_KEY`; callers must then send the same value in the `x-api-key` header. Leave it unset only for local testing.

By default, `SMS_PROVIDER=mock` returns `mocked` results and sends nothing. To submit actual India SMS through MSG91, set these environment variables before starting:

```powershell
$env:SMS_PROVIDER = 'msg91'
$env:MSG91_AUTH_KEY = 'your-auth-key'
$env:MSG91_FLOW_ID = 'your-approved-flow-id'
$env:MSG91_MESSAGE_VARIABLE = 'VAR1'
$env:MSG91_COUNTRY = '91'
npm.cmd start
```

Use an approved MSG91 Flow/DLT template for production. The older direct-message mode is also supported with `MSG91_SENDER_ID` and `MSG91_ROUTE=1`, but provider balance, sender registration, approved templates, consent, and promotional/DLT rules still apply. This is not a permanently free SMS channel.

Keep the phone and computer on the same Wi-Fi. Set the computer's Wi-Fi address in `mobile/src/config/api.ts`. Android cleartext LAN access is enabled in `mobile/app.json` for this local test.
"# A2ZListMessagingTrialServer" 
"# A2ZListMessagingTrialServer" 
"# A2ZListMessagingTrialServer" 
