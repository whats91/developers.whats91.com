# Whats91 Webhook API LLM Guide

Use this Markdown brief as implementation context for LLMs that need to generate or debug Whats91 Webhooks v2 integrations.

## Project Context

- Product: Whats91 Developer Docs.
- API family: Public API v2 only.
- Base URL: `https://graph.whats91.com/api/v2`.
- Webhook management base path: `/api/v2/webhooks`.
- Event catalog endpoint: `GET /api/v2/webhooks/events`.
- Create endpoint: `POST /api/v2/webhooks`.
- List endpoint: `GET /api/v2/webhooks`.
- Get endpoint: `GET /api/v2/webhooks/:webhookUid`.
- Update endpoint: `POST /api/v2/webhooks/:webhookUid`.
- Public API v2 webhook APIs manage Whats91 outbound event destinations.
- These APIs do not change Meta callback override URLs or legacy Cloud API setup fields.
- Webhooks deliver real-time WhatsApp events to an HTTPS endpoint.
- Sender selection uses `senderId`, which is the WhatsApp sender phone number.
- If a token is number-scoped or resolves one default sender, `senderId` can be omitted.

## Authentication

Use server-side bearer token authentication.

```http
Authorization: Bearer w91_live_xxx
Content-Type: application/json
```

Do not expose Whats91 bearer tokens in browser or mobile frontend code. Call Whats91 from a trusted backend service.

For POST compatibility, body fields such as `authToken`, `auth_token`, or `token` may be accepted, but the recommended approach is the `Authorization` header.

## Event Catalog

Before creating a webhook, fetch the supported event catalog.

```bash
curl -X GET "https://graph.whats91.com/api/v2/webhooks/events" \
  -H "Authorization: Bearer w91_live_xxx"
```

Example response:

```json
{
  "success": true,
  "message": "Webhook event catalog retrieved",
  "data": {
    "groups": [],
    "eventKeys": [
      "message.inbound.text",
      "message.status.delivered",
      "template.status_update"
    ]
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

Common event keys:

- `message.inbound.text`: Incoming customer text messages.
- `message.status.delivered`: Delivery confirmation for sent messages.
- `message.status.failed`: Delivery failure tracking.
- `template.status_update`: Template review status changes.

## Create Webhook

Endpoint:

```http
POST /api/v2/webhooks
```

Required fields:

- `webhook.name`: Developer-facing webhook name.
- `webhook.endpointUrl`: HTTPS destination URL that receives Whats91 event deliveries.
- `webhook.events`: Array of supported event keys from `GET /api/v2/webhooks/events`.

Optional fields:

- `senderId`: WhatsApp sender number for multi-number customers.
- `webhook.status`: `ACTIVE` or `INACTIVE`. Defaults to `ACTIVE`.
- `webhook.timeoutMs`: Delivery timeout in milliseconds, such as `5000`.
- `webhook.retryEnabled`: Whether Whats91 should retry failed deliveries.
- `webhook.retryMaxAttempts`: Maximum retry attempts when retry is enabled.
- `webhook.verificationHeaderKey`: Custom header sent to the receiver, such as `X-CRM-Webhook-Token`.
- `webhook.verificationToken`: Shared verification token stored privately and sent in the custom header.

### cURL Create Example

```bash
curl -X POST "https://graph.whats91.com/api/v2/webhooks" \
  -H "Authorization: Bearer w91_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "916268662275",
    "webhook": {
      "name": "CRM delivery hook",
      "endpointUrl": "https://crm.example.com/webhooks/whats91",
      "events": ["message.inbound.text", "message.status.delivered"],
      "status": "ACTIVE",
      "timeoutMs": 5000,
      "retryEnabled": true,
      "retryMaxAttempts": 3,
      "verificationHeaderKey": "X-CRM-Webhook-Token",
      "verificationToken": "shared-secret"
    }
  }'
```

### Success Response

`signingSecret` is returned only when the webhook is created. Store it immediately.

```json
{
  "success": true,
  "message": "Webhook created",
  "data": {
    "webhookUid": "wh_abc",
    "uid": "wh_abc",
    "name": "CRM delivery hook",
    "endpointUrl": "https://crm.example.com/webhooks/whats91",
    "phoneNumber": "916268662275",
    "phoneNumberId": "1043189608869917",
    "events": ["message.inbound.text", "message.status.delivered"],
    "status": "ACTIVE",
    "timeoutMs": 5000,
    "retryEnabled": true,
    "retryMaxAttempts": 3,
    "verificationHeaderKey": "X-CRM-Webhook-Token",
    "hasVerificationToken": true
  },
  "signingSecret": "whsec_created_once_only",
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

## List Webhooks

Endpoint:

```http
GET /api/v2/webhooks
```

Optional query parameters:

- `senderId`
- `status`
- `event`
- `page`
- `limit`

```bash
curl -X GET "https://graph.whats91.com/api/v2/webhooks?senderId=916268662275&status=ACTIVE&event=message.inbound.text" \
  -H "Authorization: Bearer w91_live_xxx"
```

Example response:

```json
{
  "success": true,
  "message": "Webhooks retrieved",
  "data": [
    {
      "webhookUid": "wh_abc",
      "name": "CRM delivery hook",
      "endpointUrl": "https://crm.example.com/webhooks/whats91",
      "events": ["message.inbound.text", "message.status.delivered"],
      "status": "ACTIVE",
      "retryEnabled": true,
      "retryMaxAttempts": 3,
      "hasVerificationToken": true
    }
  ],
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

## Get One Webhook

Endpoint:

```http
GET /api/v2/webhooks/:webhookUid
```

```bash
curl -X GET "https://graph.whats91.com/api/v2/webhooks/wh_abc?senderId=916268662275" \
  -H "Authorization: Bearer w91_live_xxx"
```

## Update Webhook

Endpoint:

```http
POST /api/v2/webhooks/:webhookUid
```

Updates use `POST` so integrations only need `GET` and `POST`.

```bash
curl -X POST "https://graph.whats91.com/api/v2/webhooks/wh_abc" \
  -H "Authorization: Bearer w91_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "916268662275",
    "webhook": {
      "status": "INACTIVE",
      "retryEnabled": false
    }
  }'
```

Update verification token:

```json
{
  "webhook": {
    "verificationToken": "new-shared-secret"
  }
}
```

Clear verification token:

```json
{
  "webhook": {
    "clearVerificationToken": true
  }
}
```

Updating a webhook does not rotate the signing secret. Create a new webhook if you need a fresh signing secret.

## Receiver Security

Webhook receivers should validate:

- Custom verification header, such as `X-CRM-Webhook-Token`.
- Signing header, such as `X-Whats91-Signature`, when configured.
- Event key allowlist.
- HTTPS transport.
- Fast acknowledgement with HTTP 200 before long-running processing.

## Node.js Receiver Example

```js
import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.raw({ type: 'application/json' }));

const signingSecret = process.env.WHATS91_WEBHOOK_SIGNING_SECRET;
const verificationToken = process.env.WHATS91_WEBHOOK_VERIFICATION_TOKEN;

function verifySignature(rawBody, signature) {
  if (!signingSecret || !signature) return false;

  const expected = crypto
    .createHmac('sha256', signingSecret)
    .update(rawBody)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

app.post('/webhooks/whats91', async (req, res) => {
  const customToken = req.header('X-CRM-Webhook-Token');
  if (verificationToken && customToken !== verificationToken) {
    return res.sendStatus(401);
  }

  const signature = req.header('X-Whats91-Signature');
  if (!verifySignature(req.body, signature)) {
    return res.sendStatus(401);
  }

  const payload = JSON.parse(req.body.toString('utf8'));
  res.sendStatus(200);

  queueWebhookWork(payload);
});
```

## PHP Receiver Example

```php
<?php
$rawBody = file_get_contents('php://input');
$verificationToken = getenv('WHATS91_WEBHOOK_VERIFICATION_TOKEN');
$signingSecret = getenv('WHATS91_WEBHOOK_SIGNING_SECRET');

$customToken = $_SERVER['HTTP_X_CRM_WEBHOOK_TOKEN'] ?? '';
if ($verificationToken && !hash_equals($verificationToken, $customToken)) {
    http_response_code(401);
    exit;
}

$signature = $_SERVER['HTTP_X_WHATS91_SIGNATURE'] ?? '';
if ($signingSecret && $signature) {
    $expected = hash_hmac('sha256', $rawBody, $signingSecret);
    if (!hash_equals($expected, $signature)) {
        http_response_code(401);
        exit;
    }
}

$payload = json_decode($rawBody, true);
http_response_code(200);

// Queue work after acknowledging the webhook.
handleWebhookPayload($payload);
```

## Event Payload Samples

Inbound text:

```json
{
  "event": "message.inbound.text",
  "webhookUid": "wh_abc",
  "senderId": "916268662275",
  "data": {
    "from": "919888888888",
    "messageId": "wamid.HBgMOTE5...",
    "text": "I need help with my order",
    "timestamp": "2026-06-05T10:30:00.000Z"
  }
}
```

Delivered status:

```json
{
  "event": "message.status.delivered",
  "webhookUid": "wh_abc",
  "senderId": "916268662275",
  "data": {
    "messageId": "wamid.HBgMOTE5...",
    "recipient": "919888888888",
    "status": "delivered",
    "timestamp": "2026-06-05T10:31:00.000Z"
  }
}
```

Failed status:

```json
{
  "event": "message.status.failed",
  "webhookUid": "wh_abc",
  "senderId": "916268662275",
  "data": {
    "messageId": "wamid.HBgMOTE5...",
    "recipient": "919888888888",
    "status": "failed",
    "error": {
      "code": "131026",
      "message": "Message undeliverable"
    }
  }
}
```

Template status update:

```json
{
  "event": "template.status_update",
  "webhookUid": "wh_abc",
  "senderId": "916268662275",
  "data": {
    "templateName": "payment_reminder_v1",
    "category": "UTILITY",
    "language": "en",
    "status": "APPROVED"
  }
}
```

## Error Responses

Missing token:

```json
{
  "success": false,
  "message": "Missing authorization token",
  "error_code": "MISSING_AUTH_TOKEN",
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

Validation error:

```json
{
  "success": false,
  "message": "Unsupported webhook event: message.invalid",
  "error_code": "VALIDATION_FAILED",
  "details": {},
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

Common error codes:

- `MISSING_AUTH_TOKEN`: No public API token was supplied.
- `INVALID_AUTH_TOKEN`: Token is missing, expired, revoked, or inactive.
- `FEATURE_NOT_AVAILABLE`: Subscription does not include Webhooks v2.
- `WHATSAPP_SETUP_INCOMPLETE`: Whats91 cannot resolve sender context.
- `VALIDATION_FAILED`: Invalid name, events, status, timeout, retry values, verification header, or missing update fields.
- `WEBHOOK_ENDPOINT_INVALID`: Endpoint URL is malformed.
- `WEBHOOK_ENDPOINT_REQUIRES_HTTPS`: Endpoint is not HTTPS in production.
- `WEBHOOK_NOT_FOUND`: UID does not belong to the authenticated customer and resolved sender.
- `UNSUPPORTED_CONTENT_TYPE`: POST request is not JSON.

## Practical Use Cases

### CRM Handoff

Subscribe to `message.inbound.text`, then upsert a CRM conversation by customer phone number.

```js
async function handleWebhook(payload) {
  if (payload.event !== 'message.inbound.text') return;

  await crm.conversations.upsert({
    phone: payload.data.from,
    source: 'whats91',
    lastMessage: payload.data.text,
    externalMessageId: payload.data.messageId,
    receivedAt: payload.data.timestamp,
  });
}
```

### Delivery Status Sync

Subscribe to `message.status.delivered` and `message.status.failed`, then update stored message reports.

```js
async function syncDeliveryStatus(payload) {
  if (!payload.event.startsWith('message.status.')) return;

  await messageReports.updateByMetaMessageId(payload.data.messageId, {
    status: payload.data.status,
    recipient: payload.data.recipient,
    updatedAt: payload.data.timestamp,
  });
}
```

### Template Review Alerts

Subscribe to `template.status_update`, then notify operations teams when approval status changes.

```js
async function notifyTemplateReview(payload) {
  if (payload.event !== 'template.status_update') return;

  await notifications.send({
    channel: 'template-ops',
    title: 'Template status changed',
    message: `${payload.data.templateName} is now ${payload.data.status}`,
  });
}
```

## Debugging Checklist

- Confirm the request uses `Authorization: Bearer w91_live_xxx`.
- Confirm `Content-Type: application/json` for create and update.
- Confirm the endpoint URL is HTTPS in production.
- Confirm `webhook.events` contains supported event keys from `GET /api/v2/webhooks/events`.
- Confirm `senderId` is present when the token cannot resolve a default sender.
- Confirm the receiver returns HTTP 200 quickly.
- Store `signingSecret` immediately after create; it is returned only once.
- Do not expect signing secrets or verification tokens from list, get, or update responses.
- Use `status: INACTIVE` to disable a webhook.
- Create a new webhook if a fresh signing secret is required.
- Check `metadata.requestId` when contacting support.
- Use Webhooks for real-time delivery and Reports for querying stored message state.

## Related Docs

- Webhook Create: `/webhooks/create`
- Webhook Samples: `/webhooks/samples`
- Webhook Examples: `/webhooks/examples`
- Messaging API: `/messaging`
- Templates API: `/templates`
- Reports API: `/reports`
