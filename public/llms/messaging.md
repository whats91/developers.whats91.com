# Whats91 Messaging API LLM Guide

Use this file as implementation context for an LLM that needs to generate, review, or debug code for Whats91 Messaging APIs.

## Project Context

- Product: Whats91 Developer Platform.
- Scope: Public API v2 only.
- API base URL: `https://graph.whats91.com/api/v2`.
- Main Messaging endpoints:
  - `POST /api/v2/send` for approved WhatsApp template messages.
  - `POST /api/v2/chat` for text chat, media chat, buttons, and list messages.
- Authentication must be server-side. Do not expose Whats91 tokens in frontend code, mobile apps, logs, or public repositories.
- Sender selection uses `senderId`, the registered WhatsApp sender phone number, when the token cannot resolve a default sender.
- Delivery status should be tracked through Whats91 Webhooks and Reports, not by assuming the send response is final delivery.

## Authentication

Send these headers with JSON requests:

```http
Authorization: Bearer w91_live_xxx
Content-Type: application/json
```

Use a managed `w91_live_` token from the Whats91 customer dashboard. Store it in server-side environment variables.

## Common Response Shape

```json
{
  "success": true,
  "data": {
    "messageId": "wamid.xxxxx",
    "status": "sent",
    "senderId": "919999999999",
    "phoneNumberId": "1234567890",
    "receiverId": "918888888888"
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

Important fields:

- `success`: Boolean request result.
- `data.messageId`: WhatsApp/Meta message id when accepted.
- `data.status`: Whats91 acceptance status such as `sent`, `accepted`, or queued state.
- `data.senderId`: Sender used for the request.
- `data.receiverId`: Recipient number.
- `metadata.requestId`: Request trace id for debugging with support or logs.

## Send an Approved Template Message

Use `POST /api/v2/send` when sending an approved WhatsApp template outside or inside the customer service window.

Required fields:

- `to`: Recipient phone number.
- `templateName`: Approved template name.

Optional fields:

- `senderId`: Registered sender number when the token is not number-scoped.
- `parameters`: Body variable values in template order.
- `buttonParameters`: Button variable values.
- `mediaUrl`: Public media URL for media-header templates.
- `mediaFile`: Multipart upload field for media-header templates.

### cURL

```bash
curl -X POST "https://graph.whats91.com/api/v2/send" \
  -H "Authorization: Bearer w91_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "919999999999",
    "to": "918888888888",
    "templateName": "payment_reminder",
    "parameters": ["Devendar", "INV-1001"],
    "buttonParameters": ["pay_INV-1001"],
    "mediaUrl": "https://example.com/invoice.pdf"
  }'
```

### Node.js

```js
const response = await fetch("https://graph.whats91.com/api/v2/send", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.WHATS91_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    senderId: "919999999999",
    to: "918888888888",
    templateName: "payment_reminder",
    parameters: ["Devendar", "INV-1001"],
    buttonParameters: ["pay_INV-1001"],
    mediaUrl: "https://example.com/invoice.pdf",
  }),
});

const data = await response.json();
console.log(data);
```

### PHP

```php
$payload = [
    "senderId" => "919999999999",
    "to" => "918888888888",
    "templateName" => "payment_reminder",
    "parameters" => ["Devendar", "INV-1001"],
    "buttonParameters" => ["pay_INV-1001"],
    "mediaUrl" => "https://example.com/invoice.pdf",
];

$ch = curl_init("https://graph.whats91.com/api/v2/send");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer " . getenv("WHATS91_API_KEY"),
        "Content-Type: application/json",
    ],
    CURLOPT_POSTFIELDS => json_encode($payload),
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;
```

## Send a Text Chat Message

Use `POST /api/v2/chat` for free-form text messages inside the customer service window.

Required fields:

- `to`: Recipient phone number.
- `text`, `messageText`, `message_text`, `body`, or `message`: Text body.

### cURL

```bash
curl -X POST "https://graph.whats91.com/api/v2/chat" \
  -H "Authorization: Bearer w91_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "919999999999",
    "to": "918888888888",
    "type": "text",
    "text": "Your support ticket has been updated."
  }'
```

### Node.js

```js
const response = await fetch("https://graph.whats91.com/api/v2/chat", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.WHATS91_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    senderId: "919999999999",
    to: "918888888888",
    type: "text",
    text: "Your support ticket has been updated.",
  }),
});

console.log(await response.json());
```

### PHP

```php
$payload = [
    "senderId" => "919999999999",
    "to" => "918888888888",
    "type" => "text",
    "text" => "Your support ticket has been updated.",
];

$ch = curl_init("https://graph.whats91.com/api/v2/chat");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer " . getenv("WHATS91_API_KEY"),
        "Content-Type: application/json",
    ],
    CURLOPT_POSTFIELDS => json_encode($payload),
]);
echo curl_exec($ch);
curl_close($ch);
```

## Send a Media Chat Message

Use `POST /api/v2/chat` with media fields for image, video, audio, or document messages.

Supported media selectors:

- `mediaUrl`: Public hosted media URL.
- `mediaId`: Existing WhatsApp media id.
- `mediaFile`: Multipart upload field.

The direct upload limit is a 16 MB media upload limit.

### cURL with mediaUrl

```bash
curl -X POST "https://graph.whats91.com/api/v2/chat" \
  -H "Authorization: Bearer w91_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "919999999999",
    "to": "918888888888",
    "type": "document",
    "mediaUrl": "https://example.com/invoice.pdf",
    "caption": "Invoice INV-1001",
    "filename": "invoice.pdf"
  }'
```

### cURL with multipart upload

```bash
curl -X POST "https://graph.whats91.com/api/v2/chat" \
  -H "Authorization: Bearer w91_live_xxx" \
  -F "senderId=919999999999" \
  -F "to=918888888888" \
  -F "type=image" \
  -F "caption=Product photo" \
  -F "mediaFile=@product.jpg"
```

### Node.js

```js
const response = await fetch("https://graph.whats91.com/api/v2/chat", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.WHATS91_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    senderId: "919999999999",
    to: "918888888888",
    type: "document",
    mediaUrl: "https://example.com/invoice.pdf",
    caption: "Invoice INV-1001",
    filename: "invoice.pdf",
  }),
});

console.log(await response.json());
```

### PHP

```php
$payload = [
    "senderId" => "919999999999",
    "to" => "918888888888",
    "type" => "document",
    "mediaUrl" => "https://example.com/invoice.pdf",
    "caption" => "Invoice INV-1001",
    "filename" => "invoice.pdf",
];

$ch = curl_init("https://graph.whats91.com/api/v2/chat");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer " . getenv("WHATS91_API_KEY"),
        "Content-Type: application/json",
    ],
    CURLOPT_POSTFIELDS => json_encode($payload),
]);
echo curl_exec($ch);
curl_close($ch);
```

## Send a Quick Reply Button Message

Use `POST /api/v2/chat` with `type: "buttons"` and a `buttons` array.

```bash
curl -X POST "https://graph.whats91.com/api/v2/chat" \
  -H "Authorization: Bearer w91_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "919999999999",
    "to": "918888888888",
    "type": "buttons",
    "text": "Choose an option",
    "buttons": [
      { "id": "pay_now", "title": "Pay now" },
      { "id": "talk_to_agent", "title": "Agent" }
    ]
  }'
```

## Send a List Message

Use `POST /api/v2/chat` with `type: "list"` and sections/rows.

```bash
curl -X POST "https://graph.whats91.com/api/v2/chat" \
  -H "Authorization: Bearer w91_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "919999999999",
    "to": "918888888888",
    "type": "list",
    "text": "Choose a service",
    "buttonText": "View options",
    "sections": [
      {
        "title": "Services",
        "rows": [
          { "id": "billing", "title": "Billing support" },
          { "id": "technical", "title": "Technical support" }
        ]
      }
    ]
  }'
```

## Debugging Checklist

- Invalid or missing bearer token: verify the `Authorization: Bearer` header and token status in the Whats91 dashboard.
- Missing `senderId` when token cannot resolve a sender: include a registered WhatsApp sender number.
- Template not approved or wrong `templateName`: confirm the template exists and is approved by Meta.
- Missing text payload: include `text`, `messageText`, `message_text`, `body`, or `message`.
- Missing media payload: include `mediaUrl`, `mediaId`, or `mediaFile`.
- Unsupported content type: use `application/json` or `multipart/form-data`.
- 16 MB media upload limit: compress or host larger media and pass a public URL.
- Queued reconnect responses: if `queued: true`, store `queueUid` or `reportUid` and monitor Webhooks or Reports.
- Delivery not visible immediately: use Webhooks and Reports for final status such as delivered, read, and failed.

## LLM Instructions

When generating code from this guide:

1. Keep the Whats91 API token server-side.
2. Use environment variables for credentials.
3. Include error handling that logs `metadata.requestId`.
4. Treat the send response as acceptance, not final delivery.
5. Recommend Webhooks or Reports when the user asks about delivery, read, or failure status.
