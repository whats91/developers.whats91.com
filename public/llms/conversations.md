# Whats91 Conversations API LLM Guide

This Markdown file is a copy-ready implementation brief for LLMs helping developers build or debug Whats91 Conversations API integrations.

Use this file as context when generating Node.js, PHP, Python, C#, or cURL implementations for conversation report fetching, unread inbox views, mobile-number thread lookup, conversation detail views, and paginated message history.

## Project Context

- Product: Whats91 Developer Public API v2.
- API family: Conversations.
- Conversations base URL: `https://graph.whats91.com/api/v2/reports/conversations`.
- Public v2 only. Do not use `/v2/reports/conversations`.
- Conversation APIs are read-only JSON report endpoints.
- Conversation data is always scoped to the authenticated customer.
- Public APIs do not accept a `userId` filter.
- Use Messaging APIs to send messages, Webhooks for real-time events, and Conversations APIs to fetch stored conversation/report state.
- Store bearer tokens server-side only. Do not expose tokens in frontend code.

## Authentication

Send a Whats91 public v2 token in the Authorization header.

```http
Authorization: Bearer w91_live_xxxxxxxxxxxxxxxxx
Content-Type: application/json
```

GET endpoints may also accept `authToken`, `auth_token`, or `token` query parameters for compatibility. Backend integrations should prefer the Authorization header.

## Endpoint Index

| Use case | Method | Endpoint |
| --- | --- | --- |
| List conversations | GET | `/api/v2/reports/conversations` |
| Conversation summary | GET | `/api/v2/reports/conversations/summary` |
| Conversations by mobile | GET | `/api/v2/reports/conversations/by-mobile/{mobileNumber}` |
| Get one conversation | GET | `/api/v2/reports/conversations/{conversationId}` |
| Get conversation messages | GET | `/api/v2/reports/conversations/{conversationId}/messages` |

## Common Query Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `senderId` | string | No | WhatsApp sender phone number. Optional when token scope or default sender resolves it. |
| `page` | number | No | Positive integer. Default `1`. |
| `limit` | number | No | Positive integer. Default `50`, maximum `200`. |
| `dateFrom` | string | No | Start date in `YYYY-MM-DD` format. |
| `dateTo` | string | No | End date in `YYYY-MM-DD` format. |
| `search` | string | No | Matches contact name, phone, last message, or message text depending on endpoint. |
| `status` | string | No | Conversation status such as `active`, `closed`, `blocked`, or `all`. |
| `archived` | boolean | No | `true` or `false`. |
| `unreadOnly` | boolean | No | `true` or `false`. |
| `mobileNumber` | string | Conditional | Recipient phone filter or path parameter. |
| `contactPhone` | string | No | Recipient phone filter alias. |
| `lastDirection` | string | No | `inbound` or `outbound`. |
| `labelUid` | string | No | Filter conversations by assigned label. |
| `includeLabelUids` | string | No | Comma-separated labels to include. |
| `excludeLabelUids` | string | No | Comma-separated labels to exclude. |
| `labelMatchMode` | string | No | `ANY` or `ALL`. Default `ANY`. |
| `sortBy` | string | No | Conversation list: `last_message_at`, `updated_at`, `created_at`, `total_messages`, or `unread_count`. |
| `sortOrder` | string | No | `ASC` or `DESC`. |

## Expected Response Fields

Most Conversations endpoints return:

- `success`: Boolean request result.
- `message`: Human-readable response message.
- `data.senderId`: Resolved WhatsApp sender.
- `data.phoneNumberId`: Meta phone number id when available.
- `data.conversations`: Conversation list where applicable.
- `data.conversation`: One conversation where applicable.
- `data.messages`: Message list where applicable.
- `data.summary`: Aggregate totals where applicable.
- `data.pagination`: Pagination metadata for list responses.
- `metadata.apiVersion`: Public API version.
- `metadata.requestId`: Request identifier for support and debugging.

Common conversation fields:

- `conversationId`
- `contactPhone`
- `contactName`
- `senderPhoneNumber`
- `phoneNumberId`
- `lastMessageId`
- `lastMessageContent`
- `lastMessageType`
- `lastMessageAt`
- `lastMessageDirection`
- `unreadCount`
- `totalMessages`
- `isArchived`
- `isPinned`
- `isMuted`
- `isBlocked`
- `status`
- `labels`
- `createdAt`
- `updatedAt`

Common conversation message fields:

- `messageId`
- `fromPhone`
- `toPhone`
- `direction`
- `messageType`
- `messageContent`
- `mediaUrl`
- `mediaMimeType`
- `mediaFilename`
- `mediaCaption`
- `status`
- `isRead`
- `isPinned`
- `isStarred`
- `timestamp`
- `errorMessage`
- `interactiveData`
- `locationData`
- `contactData`

## 1. List Conversations

Use `GET /api/v2/reports/conversations` to list conversation report records for the resolved WhatsApp sender.

### cURL

```bash
curl "https://graph.whats91.com/api/v2/reports/conversations?senderId=919999999999&unreadOnly=true&page=1&limit=50" \
  -H "Authorization: Bearer w91_live_xxx"
```

### Node.js

```js
const token = process.env.WHATS91_API_TOKEN;

async function listUnreadConversations() {
  const url = new URL("https://graph.whats91.com/api/v2/reports/conversations");
  url.searchParams.set("senderId", "919999999999");
  url.searchParams.set("unreadOnly", "true");
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
    throw new Error(body.message || "Failed to list conversations");
  }

  return body.data.conversations;
}
```

### PHP

```php
<?php
$token = getenv('WHATS91_API_TOKEN');
$url = 'https://graph.whats91.com/api/v2/reports/conversations?senderId=919999999999&unreadOnly=true&page=1&limit=50';

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
    throw new RuntimeException($body['message'] ?? 'Failed to list conversations');
}

print_r($body['data']['conversations']);
```

### List Response

```json
{
  "success": true,
  "message": "Conversation reports retrieved",
  "data": {
    "senderId": "919999999999",
    "phoneNumberId": "1234567890",
    "conversations": [
      {
        "conversationId": 194977,
        "contactPhone": "919343841961",
        "contactName": "Prashant Tayal",
        "senderPhoneNumber": "919999999999",
        "phoneNumberId": "1234567890",
        "lastMessageId": "wamid.xxxxx",
        "lastMessageContent": "hi",
        "lastMessageType": "text",
        "lastMessageAt": "2026-06-05T06:08:48.000Z",
        "lastMessageDirection": "inbound",
        "unreadCount": 1,
        "totalMessages": 2,
        "isArchived": false,
        "isPinned": false,
        "isMuted": false,
        "isBlocked": false,
        "status": "active",
        "labels": [
          {
            "uid": "lbl_support",
            "labelName": "Support"
          }
        ],
        "createdAt": "2026-06-05T06:08:48.000Z",
        "updatedAt": "2026-06-05T06:08:50.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1,
      "totalPages": 1,
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

## 2. Conversation Summary

Use `GET /api/v2/reports/conversations/summary` to return aggregate totals for the same filters used by the list endpoint.

```bash
curl "https://graph.whats91.com/api/v2/reports/conversations/summary?senderId=919999999999&dateFrom=2026-06-01&dateTo=2026-06-05" \
  -H "Authorization: Bearer w91_live_xxx"
```

### Summary Response

```json
{
  "success": true,
  "message": "Conversation summary retrieved",
  "data": {
    "summary": {
      "totalConversations": 12,
      "unreadConversations": 3,
      "archivedConversations": 2,
      "activeConversations": 10,
      "inboundLastCount": 7,
      "outboundLastCount": 5
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

## 3. Conversations By Mobile

Use `GET /api/v2/reports/conversations/by-mobile/{mobileNumber}` to list conversation thread summaries for one recipient phone number.

```bash
curl "https://graph.whats91.com/api/v2/reports/conversations/by-mobile/919343841961?senderId=919999999999" \
  -H "Authorization: Bearer w91_live_xxx"
```

## 4. Get One Conversation

Use `GET /api/v2/reports/conversations/{conversationId}` to retrieve one conversation by numeric conversation id.

```bash
curl "https://graph.whats91.com/api/v2/reports/conversations/194977?senderId=919999999999" \
  -H "Authorization: Bearer w91_live_xxx"
```

## 5. Conversation Messages

Use `GET /api/v2/reports/conversations/{conversationId}/messages` to retrieve paginated messages inside one conversation.

### Query Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `conversationId` | number | Yes | Existing numeric conversation id in the path. |
| `senderId` | string | No | WhatsApp sender phone number. |
| `direction` | string | No | `inbound` or `outbound`. |
| `messageType` | string | No | `text`, `image`, `video`, `document`, `interactive`, etc. |
| `status` | string | No | `pending`, `sent`, `delivered`, `read`, `failed`, or `all`. |
| `search` | string | No | Matches message text. |
| `page` | number | No | Positive integer. Default `1`. |
| `limit` | number | No | Positive integer. Default `50`, maximum `200`. |
| `sortBy` | string | No | `timestamp`, `created_at`, or `updated_at`. |
| `sortOrder` | string | No | `ASC` or `DESC`. |

```bash
curl "https://graph.whats91.com/api/v2/reports/conversations/194977/messages?senderId=919999999999&direction=inbound&page=1&limit=50" \
  -H "Authorization: Bearer w91_live_xxx"
```

### Messages Response

```json
{
  "success": true,
  "message": "Conversation messages retrieved",
  "data": {
    "conversationId": 194977,
    "messages": [
      {
        "messageId": "wamid.xxxxx",
        "fromPhone": "919343841961",
        "toPhone": "919999999999",
        "direction": "inbound",
        "messageType": "text",
        "messageContent": "hi",
        "mediaUrl": null,
        "mediaMimeType": null,
        "mediaFilename": null,
        "mediaCaption": null,
        "status": "read",
        "isRead": true,
        "isPinned": false,
        "isStarred": false,
        "timestamp": "2026-06-05T06:08:48.000Z",
        "errorMessage": null,
        "interactiveData": null,
        "locationData": null,
        "contactData": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1,
      "totalPages": 1,
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

## Error Examples

### Conversation not found

```json
{
  "success": false,
  "message": "Conversation not found",
  "error_code": "CONVERSATION_NOT_FOUND",
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
  "message": "sortBy is not supported for conversations",
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
| 403 | `FEATURE_NOT_AVAILABLE` | Customer does not have message reports access. |
| 400 | `WHATSAPP_SETUP_INCOMPLETE` | Sender context could not resolve a usable WhatsApp number. |
| 400 | `VALIDATION_FAILED` | Invalid date range, pagination, boolean, status, sort field, label mode, conversation id, or mobile number. |
| 404 | `CONVERSATION_NOT_FOUND` | Conversation id does not belong to the authenticated customer and sender. |

## Debugging Checklist

- Confirm the request uses `https://graph.whats91.com/api/v2/reports/conversations`.
- Do not use `/v2/reports/conversations`.
- Send `Authorization: Bearer w91_live_xxx` on every request.
- Keep tokens server-side only.
- Pass `senderId` when the token does not resolve a default sender.
- Do not pass `userId`; conversation data is scoped to the authenticated customer.
- Use `YYYY-MM-DD` for `dateFrom` and `dateTo`.
- Keep `limit` between `1` and `200`.
- Use `status=active`, `status=closed`, `status=blocked`, or `status=all` for conversation filters.
- Use `unreadOnly=true` to fetch unread conversation rows.
- Use `lastDirection=inbound` or `lastDirection=outbound` for last-message direction filtering.
- Use `labelUid`, `includeLabelUids`, `excludeLabelUids`, and `labelMatchMode=ANY|ALL` for label filtering.
- Use numeric `conversationId` values returned by list or by-mobile endpoints.
- For message history, use `direction=inbound|outbound` and valid `messageType` or `status` filters.
- Preserve `metadata.requestId` when contacting support.

## Related Documentation

- Messaging API: `/messaging`
- Webhooks API: `/webhooks`
- Reports API: `/reports`
- Conversations docs: `/conversations`
