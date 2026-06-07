# Whats91 Blacklist API LLM Guide

This Markdown file is a copy-ready implementation brief for LLMs helping developers build or debug Whats91 Message Blacklist API integrations.

Use this file as context when generating Node.js, PHP, Python, C#, or cURL implementations for listing, retrieving, adding, updating, and deleting sender-scoped blacklist entries.

## Project Context

- Product: Whats91 Developer Public API v2.
- API family: Message Blacklist.
- Blacklist base URL: `https://graph.whats91.com/api/v2/message-blacklist`.
- Public v2 only. Do not use internal blacklist routes.
- Blacklist entries are sender-scoped.
- If a recipient is active in the blacklist for a sender, Whats91 send paths block delivery before Meta is called.
- Global tokens can manage any owned sender by passing `senderId`.
- Number-scoped tokens can only manage their bound sender.
- Store bearer tokens server-side only. Do not expose tokens in frontend code.

## Authentication

Send a Whats91 public v2 token in the Authorization header.

```http
Authorization: Bearer w91_public_token_here
Content-Type: application/json
```

GET endpoints also accept `authToken`, `auth_token`, or `token` in the query string for compatibility. Backend integrations should prefer the Authorization header.

## Endpoint Index

| Use case | Method | Endpoint |
| --- | --- | --- |
| List blacklist entries | GET | `/api/v2/message-blacklist` |
| Get one blacklist entry | GET | `/api/v2/message-blacklist/{blacklistUid}` |
| Add or reactivate a number | POST | `/api/v2/message-blacklist` |
| Update one entry | POST | `/api/v2/message-blacklist/{blacklistUid}` |
| Delete one entry | DELETE | `/api/v2/message-blacklist/{blacklistUid}` |

## Common Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `senderId` | string | Conditional | WhatsApp registered sender number. Required when the token is not bound to one sender. |
| `blacklistUid` | string | Yes for get/update/delete | Public blacklist entry UID, for example `bl_abc`. |
| `phone` | string | Yes for add | Recipient phone number to blacklist. |
| `reason` | string | No | Operational reason such as customer opt-out. |
| `source` | string | No | Source label such as `MANUAL`. |
| `status` | string | No | `ACTIVE` or `INACTIVE` for updates; list accepts `ACTIVE`, `INACTIVE`, or `ALL`. |
| `search` | string | No | Matches normalized phone, display phone, or reason. |
| `page` | number | No | Positive integer. Default `1`. |
| `limit` | number | No | Page size. Default `50`. |

## Expected Response Fields

Most blacklist endpoints return:

- `success`: Boolean request result.
- `message`: Human-readable response message.
- `data.senderId`: Resolved WhatsApp sender.
- `data.phoneNumberId`: Meta phone number id when available.
- `data.wabaId`: WhatsApp Business Account id when available.
- `data.blacklistEntry`: One blacklist entry where applicable.
- `data.blacklistEntries`: Blacklist entries list where applicable.
- `data.items`: Alias for generic paginated clients where applicable.
- `data.pagination`: Pagination metadata for list responses.
- `metadata.apiVersion`: Public API version.
- `metadata.requestId`: Request identifier for support and debugging.

Common blacklist entry fields:

- `blacklistUid`
- `uid`
- `phoneNumberId`
- `senderPhoneNumber`
- `normalizedPhone`
- `displayPhone`
- `source`
- `reason`
- `status`
- `createdAt`
- `updatedAt`
- `deactivatedAt`

## 1. List Blacklist Entries

Use `GET /api/v2/message-blacklist` to list sender-scoped blacklist entries.

### Query Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `senderId` | string | Conditional | Required for global tokens and optional for number-scoped tokens. |
| `status` | string | No | `ACTIVE`, `INACTIVE`, or `ALL`. Default `ACTIVE`. |
| `search` | string | No | Search normalized phone, display phone, or reason. |
| `page` | number | No | Positive integer page number. Default `1`. |
| `limit` | number | No | Page size. Default `50`. |

### cURL

```bash
curl -X GET "https://graph.whats91.com/api/v2/message-blacklist?senderId=916268662275&page=1&limit=50&status=ACTIVE" \
  -H "Authorization: Bearer w91_public_token_here"
```

### Node.js

```js
const token = process.env.WHATS91_API_TOKEN;

async function listBlacklistEntries() {
  const url = new URL("https://graph.whats91.com/api/v2/message-blacklist");
  url.searchParams.set("senderId", "916268662275");
  url.searchParams.set("page", "1");
  url.searchParams.set("limit", "50");
  url.searchParams.set("status", "ACTIVE");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const body = await response.json();
  if (!response.ok || !body.success) {
    throw new Error(body.message || "Failed to list blacklist entries");
  }

  return body.data.blacklistEntries;
}
```

### PHP

```php
<?php
$token = getenv('WHATS91_API_TOKEN');
$url = 'https://graph.whats91.com/api/v2/message-blacklist?senderId=916268662275&page=1&limit=50&status=ACTIVE';

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
    throw new RuntimeException($body['message'] ?? 'Failed to list blacklist entries');
}

print_r($body['data']['blacklistEntries']);
```

### Success Response

```json
{
  "success": true,
  "message": "Blacklist entries retrieved",
  "data": {
    "senderId": "916268662275",
    "phoneNumberId": "1234567890",
    "wabaId": "9876543210",
    "blacklistEntries": [
      {
        "blacklistUid": "bl_abc",
        "uid": "bl_abc",
        "phoneNumberId": "1234567890",
        "senderPhoneNumber": "916268662275",
        "normalizedPhone": "919876543210",
        "displayPhone": "9876543210",
        "source": "MANUAL",
        "reason": "Customer requested opt-out",
        "status": "ACTIVE",
        "createdAt": "2026-06-06T08:00:00.000Z",
        "updatedAt": "2026-06-06T08:00:00.000Z",
        "deactivatedAt": null
      }
    ],
    "items": [
      {
        "blacklistUid": "bl_abc",
        "normalizedPhone": "919876543210",
        "status": "ACTIVE"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "count": 1,
      "hasMore": false
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

## 2. Get One Blacklist Entry

Use `GET /api/v2/message-blacklist/{blacklistUid}` to retrieve one sender-scoped blacklist entry.

```bash
curl -X GET "https://graph.whats91.com/api/v2/message-blacklist/bl_abc?senderId=916268662275" \
  -H "Authorization: Bearer w91_public_token_here"
```

## 3. Add Or Reactivate A Number

Use `POST /api/v2/message-blacklist` to add or reactivate a blacklisted phone number for the resolved sender.

```bash
curl -X POST "https://graph.whats91.com/api/v2/message-blacklist" \
  -H "Authorization: Bearer w91_public_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "916268662275",
    "phone": "98765 43210",
    "reason": "Customer requested opt-out",
    "source": "MANUAL"
  }'
```

### Add Behavior

- Phone numbers are normalized using the same contact-book phone rules.
- Duplicate active rows for the same customer, sender, and normalized phone are not created.
- Re-adding an inactive number reactivates it.
- Blacklist cache for that customer is invalidated after the write.
- Active blacklist entries block send paths before Meta is called.

### Add Response

```json
{
  "success": true,
  "message": "Blacklist entry saved",
  "data": {
    "blacklistEntry": {
      "blacklistUid": "bl_abc",
      "normalizedPhone": "919876543210",
      "displayPhone": "9876543210",
      "source": "MANUAL",
      "reason": "Customer requested opt-out",
      "status": "ACTIVE"
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

## 4. Update One Entry

Use `POST /api/v2/message-blacklist/{blacklistUid}` to update `reason` or `status`. Supported status values are `ACTIVE` and `INACTIVE`.

```bash
curl -X POST "https://graph.whats91.com/api/v2/message-blacklist/bl_abc" \
  -H "Authorization: Bearer w91_public_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "916268662275",
    "reason": "Updated opt-out reason",
    "status": "INACTIVE"
  }'
```

Send at least one editable field. Empty update payloads return `VALIDATION_FAILED`.

## 5. Delete One Entry

Use `DELETE /api/v2/message-blacklist/{blacklistUid}` to soft-remove an active blacklist entry for a sender.

Delete is a soft removal. The row is marked `INACTIVE`, `deactivatedAt` is set, and future sends are no longer blocked for that recipient unless it is reactivated.

```bash
curl -X DELETE "https://graph.whats91.com/api/v2/message-blacklist/bl_abc?senderId=916268662275" \
  -H "Authorization: Bearer w91_public_token_here"
```

### Delete Response

```json
{
  "success": true,
  "message": "Blacklist entry removed",
  "data": {
    "blacklistEntry": {
      "blacklistUid": "bl_abc",
      "status": "INACTIVE",
      "deactivatedAt": "2026-06-06T09:20:00.000Z"
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

## Error Examples

### Not found

```json
{
  "success": false,
  "message": "Blacklist entry not found",
  "error_code": "BLACKLIST_ENTRY_NOT_FOUND",
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
  "message": "status must be ACTIVE, INACTIVE, or ALL",
  "error_code": "VALIDATION_FAILED",
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

## Common Error Codes

| HTTP | Error code | Scenario |
| --- | --- | --- |
| 401 | `MISSING_AUTH_TOKEN` | No public token was supplied. |
| 401 | `INVALID_AUTH_TOKEN` | Token is invalid, expired, revoked, or not tied to an active customer. |
| 403 | `SENDER_NOT_ALLOWED` | Number-scoped token requested another sender. |
| 403 | `FEATURE_NOT_AVAILABLE` | Customer does not have the contacts or blacklist feature. |
| 400 | `WHATSAPP_SETUP_INCOMPLETE` | Sender context could not resolve a usable WhatsApp number. |
| 400 | `VALIDATION_FAILED` | Invalid phone, status, pagination, or empty update payload. |
| 404 | `BLACKLIST_ENTRY_NOT_FOUND` | UID does not belong to the authenticated sender. |
| 415 | `UNSUPPORTED_CONTENT_TYPE` | POST body is not JSON. |

## Debugging Checklist

- Confirm the request uses `https://graph.whats91.com/api/v2/message-blacklist`.
- Send `Authorization: Bearer w91_public_token_here` on every request.
- Send `Content-Type: application/json` on POST requests.
- Keep tokens server-side only.
- Pass `senderId` when using a global token.
- Do not request another sender with a number-scoped token.
- Use `status=ACTIVE`, `status=INACTIVE`, or `status=ALL` for list requests.
- Use `status=ACTIVE` or `status=INACTIVE` for update requests.
- Include `phone` when adding a number.
- Use the returned `blacklistUid` for get, update, and delete requests.
- Send at least one editable field when updating an entry.
- Remember delete is a soft removal and sets the row to `INACTIVE`.
- Preserve `metadata.requestId` when contacting support.

## Related Documentation

- Messaging API: `/messaging`
- Contact Book API: `/contact-books`
- Reports API: `/reports`
- Blacklist docs: `/blacklist`
