# Whats91 Chatbot API LLM Guide

This Markdown file is a copy-ready implementation brief for LLMs helping developers build or debug Whats91 Chatbot API integrations.

Use this file as context when generating Node.js, PHP, Python, C#, or cURL implementations for listing chatbots, retrieving one chatbot, and creating text, media, button, CTA, or list-response chatbots.

## Project Context

- Product: Whats91 Developer Public API v2.
- API family: Chatbots.
- Chatbot base URL: `https://graph.whats91.com/api/v2/chatbots`.
- Public v2 only. Do not use older or internal chatbot routes.
- Chatbot APIs configure automated WhatsApp replies; creation endpoints do not send an immediate WhatsApp message.
- Use Messaging APIs for outbound messages, Webhooks for inbound and delivery events, and Reports for stored message state.
- Store bearer tokens server-side only. Do not expose tokens in frontend code.

## Authentication

Send a Whats91 public v2 token in the Authorization header.

```http
Authorization: Bearer w91_public_token_here
Content-Type: application/json
```

`senderId` is optional for sender-bound tokens. Global tokens should pass the WhatsApp sender number.

## Endpoint Index

| Use case | Method | Endpoint |
| --- | --- | --- |
| List chatbot rules | GET | `/api/v2/chatbots` |
| Get one chatbot | GET | `/api/v2/chatbots/{chatbotUid}` |
| Create generic chatbot | POST | `/api/v2/chatbots` |
| Create text chatbot | POST | `/api/v2/chatbots/text` |
| Create media chatbot | POST | `/api/v2/chatbots/media` |
| Create interactive chatbot | POST | `/api/v2/chatbots/interactive` |

## Common Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `senderId` | string | Conditional | WhatsApp sender number for global tokens. |
| `chatbot.name` | string | Yes | Human-readable chatbot name. |
| `chatbot.trigger.type` | string | No | `contains`, `exact`, `starts_with`, `ends_with`, `contains_whole_word`, `regex`, or `welcome`. |
| `chatbot.trigger.keywords` | string[] | Conditional | Keyword list. Required unless `trigger.keyword` is supplied. |
| `chatbot.trigger.keyword` | string | Conditional | Single keyword shortcut. Required unless `trigger.keywords` is supplied. |
| `chatbot.priority` | number | No | Optional priority clamped between 0 and 255. |
| `chatbot.status` | string | No | `ACTIVE` or `INACTIVE`. Defaults to `ACTIVE`. |
| `chatbot.response.type` | string | Yes for generic/interactive | `text`, `media`, `buttons`, `cta`, or `list`. |
| `chatbot.response.text` | string | Conditional | Plain text response or main interactive message body. |
| `chatbot.response.media.url` | string | For media | Public HTTPS media URL. |
| `chatbot.response.buttons` | array | For buttons | Up to three buttons. Each item needs `id` and `label`. |
| `chatbot.response.ctaUrl` | string | For CTA | HTTPS URL for CTA replies. |
| `chatbot.response.sections` | array | For list | List sections containing rows. |

## Expected Response Fields

Most chatbot endpoints return:

- `success`: Boolean request result.
- `message`: Human-readable response message.
- `data.senderId`: Resolved WhatsApp sender.
- `data.phoneNumberId`: Meta phone number id when available.
- `data.wabaId`: WhatsApp Business Account id when available.
- `data.chatbot` or `data.chatbots`: Chatbot object or list.
- `data.pagination`: Pagination metadata for list responses.
- `metadata.apiVersion`: Public API version.
- `metadata.requestId`: Request identifier for support and debugging.

Common chatbot fields:

- `chatbotUid`
- `uid`
- `name`
- `botType`
- `triggerType`
- `replyTrigger`
- `replyText`
- `status`
- `priority`

## 1. List Chatbots

Use `GET /api/v2/chatbots` to retrieve chatbot rules for the authenticated customer and resolved WhatsApp sender.

### Query Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `senderId` | string | Conditional | Required for global tokens and optional for number-scoped tokens. |
| `status` | string | No | `ACTIVE` or `INACTIVE`. |
| `type` | string | No | `simple`, `media`, or `advanced`. |
| `trigger` | string | No | Search inside trigger keywords or keyword text. |
| `page` | number | No | Positive integer page number. Default `1`. |
| `limit` | number | No | Page size. Default `50`. |

### cURL

```bash
curl -X GET "https://graph.whats91.com/api/v2/chatbots?senderId=916268662275&status=ACTIVE&page=1&limit=50" \
  -H "Authorization: Bearer w91_public_token_here"
```

### Node.js

```js
const token = process.env.WHATS91_API_TOKEN;

async function listChatbots() {
  const url = new URL("https://graph.whats91.com/api/v2/chatbots");
  url.searchParams.set("senderId", "916268662275");
  url.searchParams.set("status", "ACTIVE");
  url.searchParams.set("page", "1");
  url.searchParams.set("limit", "50");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const body = await response.json();
  if (!response.ok || !body.success) {
    throw new Error(body.message || "Failed to list chatbots");
  }

  return body.data.chatbots;
}
```

### PHP

```php
<?php
$token = getenv('WHATS91_API_TOKEN');
$url = 'https://graph.whats91.com/api/v2/chatbots?senderId=916268662275&status=ACTIVE&page=1&limit=50';

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer {$token}",
        "Content-Type: application/json",
    ],
]);

$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
curl_close($ch);

$body = json_decode($response, true);
if ($status >= 400 || empty($body['success'])) {
    throw new RuntimeException($body['message'] ?? 'Failed to list chatbots');
}

print_r($body['data']['chatbots']);
```

### Success Response

```json
{
  "success": true,
  "message": "Chatbots retrieved",
  "data": {
    "senderId": "916268662275",
    "chatbots": [
      {
        "chatbotUid": "bot_invoice_help",
        "uid": "bot_invoice_help",
        "name": "Invoice Help",
        "botType": "simple",
        "triggerType": "contains",
        "replyTrigger": "invoice, bill",
        "replyText": "Please share your invoice number.",
        "status": 1,
        "priority": 5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1,
      "hasMore": false
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

## 2. Get One Chatbot

Use `GET /api/v2/chatbots/{chatbotUid}` to retrieve one chatbot by public chatbot UID.

```bash
curl -X GET "https://graph.whats91.com/api/v2/chatbots/bot_invoice_help?senderId=916268662275" \
  -H "Authorization: Bearer w91_public_token_here"
```

## 3. Create Generic Chatbot

Use `POST /api/v2/chatbots` when you want one creation endpoint and will specify `chatbot.response.type`.

```bash
curl -X POST "https://graph.whats91.com/api/v2/chatbots" \
  -H "Authorization: Bearer w91_public_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "916268662275",
    "chatbot": {
      "name": "General Help",
      "trigger": {
        "type": "contains",
        "keywords": ["help", "support"]
      },
      "priority": 5,
      "status": "ACTIVE",
      "response": {
        "type": "text",
        "text": "How can we help you today?"
      }
    }
  }'
```

## 4. Create Text Chatbot

Use `POST /api/v2/chatbots/text` for simple keyword-triggered text replies.

```bash
curl -X POST "https://graph.whats91.com/api/v2/chatbots/text" \
  -H "Authorization: Bearer w91_public_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "916268662275",
    "chatbot": {
      "name": "Invoice Help",
      "trigger": {
        "type": "contains",
        "keywords": ["invoice", "bill"]
      },
      "response": {
        "text": "Please share your invoice number."
      }
    }
  }'
```

Practical text chatbot examples:

- Invoice Help: trigger `invoice, bill`; reply with invoice-number request.
- Order Tracking: trigger `track, order status`; ask for order ID.
- Support Hours: trigger `hours, timing`; send support availability.
- Lead Capture: trigger `pricing, demo`; ask for name and business email.
- Appointment Reminder: trigger `appointment, booking`; ask for appointment ID.
- Return Policy: trigger `return, refund`; ask for order ID and explain next step.

## 5. Create Media Chatbot

Use `POST /api/v2/chatbots/media` for IMAGE, VIDEO, AUDIO, and DOCUMENT chatbot replies. Media URLs must be public HTTPS URLs that Whats91 and Meta can fetch.

```bash
curl -X POST "https://graph.whats91.com/api/v2/chatbots/media" \
  -H "Authorization: Bearer w91_public_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "916268662275",
    "chatbot": {
      "name": "Catalog PDF",
      "trigger": { "keyword": "catalog" },
      "response": {
        "text": "Here is our latest catalog.",
        "media": {
          "type": "DOCUMENT",
          "url": "https://cdn.example.com/catalog.pdf",
          "fileName": "catalog.pdf"
        }
      }
    }
  }'
```

Rejected media inputs:

- `http://` URLs.
- `localhost`, private IP, and `.local` URLs.
- `metaMediaId`, `mediaId`, or pre-uploaded Meta media references.
- Base64 strings, file paths, multipart upload fields, and direct uploads.

## 6. Create Interactive Chatbot

Use `POST /api/v2/chatbots/interactive` for WhatsApp interactive responses: `buttons`, `cta`, and `list`.

### Button Chatbot

```bash
curl -X POST "https://graph.whats91.com/api/v2/chatbots/interactive" \
  -H "Authorization: Bearer w91_public_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "916268662275",
    "chatbot": {
      "name": "Support Choices",
      "trigger": { "keyword": "help" },
      "response": {
        "type": "buttons",
        "text": "How can we help?",
        "footerText": "Whats91",
        "buttons": [
          { "id": "sales", "label": "Sales" },
          { "id": "support", "label": "Support" }
        ]
      }
    }
  }'
```

### CTA Body

```json
{
  "senderId": "916268662275",
  "chatbot": {
    "name": "Open Portal",
    "trigger": { "keyword": "portal" },
    "response": {
      "type": "cta",
      "text": "Open your customer portal.",
      "ctaText": "Open",
      "ctaUrl": "https://app.example.com"
    }
  }
}
```

### List Body

```json
{
  "senderId": "916268662275",
  "chatbot": {
    "name": "Department Menu",
    "trigger": { "keyword": "menu" },
    "response": {
      "type": "list",
      "text": "Choose a department.",
      "footerText": "Whats91",
      "sections": [
        {
          "title": "Departments",
          "rows": [
            { "id": "sales", "title": "Sales", "description": "Talk to sales" },
            { "id": "support", "title": "Support", "description": "Get product help" }
          ]
        }
      ]
    }
  }
}
```

Interactive validation notes:

- Buttons are limited to three choices.
- Every button requires `id` and `label`.
- CTA replies require `ctaText` and `ctaUrl`.
- CTA URLs must use HTTPS.
- List responses require `sections`.
- Each section requires `rows`.
- Each row requires `id` and `title`.

## Error Examples

### Chatbot not found

```json
{
  "success": false,
  "error": {
    "code": "CHATBOT_NOT_FOUND",
    "message": "Chatbot UID does not belong to the authenticated sender."
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

### Validation failed

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Missing name, trigger, response text, button labels, list rows, invalid status, or invalid CTA URL."
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

## Common Error Codes

| HTTP | Error code | Scenario |
| --- | --- | --- |
| 401 | `MISSING_AUTH_TOKEN` | No public API token supplied. |
| 401 | `INVALID_AUTH_TOKEN` | Token is invalid, expired, revoked, or not tied to an active customer. |
| 403 | `SENDER_NOT_ALLOWED` | Number-scoped token attempted another sender. |
| 403 | `FEATURE_NOT_AVAILABLE` | Customer subscription does not include chatbots. |
| 400 | `MISSING_CHATBOT` | Request body does not include `chatbot`. |
| 400 | `VALIDATION_FAILED` | Invalid chatbot field, missing response data, invalid CTA URL, or invalid list/button shape. |
| 400 | `WHATSAPP_SETUP_INCOMPLETE` | Sender setup could not be resolved. |
| 404 | `CHATBOT_NOT_FOUND` | Chatbot UID does not belong to the authenticated sender. |
| 415 | `UNSUPPORTED_CONTENT_TYPE` | POST request is not JSON. |

## Debugging Checklist

- Confirm the request uses `https://graph.whats91.com/api/v2/chatbots`.
- Send `Authorization: Bearer w91_public_token_here` on every request.
- Send `Content-Type: application/json` on POST requests.
- Keep tokens server-side only.
- Pass `senderId` when using a global token.
- Confirm `chatbot.name` is present for create requests.
- Provide either `chatbot.trigger.keywords` or `chatbot.trigger.keyword`.
- Use a valid `chatbot.trigger.type`.
- For generic creation, set `chatbot.response.type`.
- For text chatbots, include `chatbot.response.text`.
- For media chatbots, include a public HTTPS `chatbot.response.media.url`.
- For button chatbots, send no more than three `buttons`.
- For CTA chatbots, include an HTTPS `ctaUrl`.
- For list chatbots, include `sections` and row objects with `id` and `title`.
- Save `metadata.requestId` when reporting API issues.

## Related Documentation

- Messaging API: `/messaging`
- Webhooks API: `/webhooks`
- Reports API: `/reports`
- Chatbot docs: `/chatbots`
