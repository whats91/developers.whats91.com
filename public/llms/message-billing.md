# Whats91 Message Billing API LLM Guide

This Markdown file is a copy-ready implementation brief for LLMs helping developers build or debug Whats91 Message Billing API integrations.

Use this file as context when generating Node.js, PHP, Python, C#, or cURL implementations for billing reconciliation, sender-level billing reports, template-category cost analysis, payable/free classification, wallet balance checks, and wallet transaction history.

## Project Context

- Product: Whats91 Developer Public API v2.
- API family: Message Billing.
- Billing base URL: `https://graph.whats91.com/api/v2/billing`.
- Public v2 only. Do not use `/v2/billing`.
- Billing APIs are read-only JSON APIs.
- Use these APIs from backend services, admin tools, reconciliation jobs, finance dashboards, and report exports.
- Do not expose bearer tokens in frontend code.
- Delivery lifecycle should be tracked with Reports and Webhooks; billing APIs are for charge and wallet reconciliation.

## Authentication

Send a Whats91 public v2 token in the Authorization header.

```http
Authorization: Bearer w91_live_xxx
Content-Type: application/json
```

GET endpoints may also accept `authToken`, `auth_token`, or `token` query parameters for compatibility, but backend integrations should prefer the Authorization header.

## Common Query Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `senderId` | string | No | WhatsApp sender phone number. Useful for sender-scoped billing. |
| `phoneNumberId` | string | No | Meta phone number id. Number-scoped tokens cannot read another sender. |
| `page` | number | No | Positive integer. Default `1`. |
| `limit` | number | No | Positive integer. Default `50`, maximum `200`. |
| `dateFrom` | string | No | Start date in `YYYY-MM-DD` format. |
| `dateTo` | string | No | End date in `YYYY-MM-DD` format. |
| `status` | string | No | Message billing status such as `accepted`, `sent`, `delivered`, `read`, `failed`, or `pending`. |
| `templateType` | string | No | Meta pricing category: `marketing`, `utility`, `authentication`, or `service`. |
| `billable` | string | No | `true`, `false`, `payable`, or `free`. |
| `pricingType` | string | No | Meta pricing type when available. |
| `messageId` | string | No | Exact Meta message id. |
| `recipient` | string | No | Recipient phone number. |
| `conversationId` | string | No | Meta conversation id. |
| `sortBy` | string | No | `created_at`, `message_timestamp`, `pricing_category`, `status`, or `rate`. |
| `sortOrder` | string | No | `ASC` or `DESC`. |

## Endpoint Index

| Use case | Method | Endpoint |
| --- | --- | --- |
| User-wide billing history | GET | `/api/v2/billing/messages` |
| Number-specific billing history | GET | `/api/v2/billing/messages/by-number/{phoneNumberId}` |
| Template-type billing history | GET | `/api/v2/billing/messages/by-template-type/{templateType}` |
| Delivered billing records | GET | `/api/v2/billing/messages/delivered` |
| Payable billing records | GET | `/api/v2/billing/messages/payable` |
| Free billing records | GET | `/api/v2/billing/messages/free` |
| Billing summary | GET | `/api/v2/billing/summary` |
| Wallet balance | GET | `/api/v2/billing/wallet` |
| Wallet history | GET | `/api/v2/billing/wallet/history` |

## Expected Response Fields

Most billing endpoints return:

- `success`: Boolean request result.
- `message`: Human-readable API response message.
- `data.billingRecords`: Array of billing rows where applicable.
- `data.pagination`: Pagination metadata for list responses.
- `data.summary`: Billing totals for summary and payable views.
- `metadata.apiVersion`: Public API version.
- `metadata.requestId`: Request identifier for support and debugging.

Common billing row fields:

- `billingUid`
- `messageId`
- `phoneNumberId`
- `senderPhoneNumber`
- `recipientId`
- `status`
- `billable`
- `billingClass`
- `pricingModel`
- `pricingCategory`
- `templateType`
- `pricingType`
- `rate`
- `conversationId`
- `conversationOriginType`
- `messageTimestamp`
- `createdAt`
- `updatedAt`

## 1. User-wide Billing History

Use `GET /api/v2/billing/messages` to list billing records across the authenticated customer account. If the token is global and `senderId` is omitted, the result can include records across WhatsApp sender numbers.

### cURL

```bash
curl "https://graph.whats91.com/api/v2/billing/messages?dateFrom=2026-06-01&limit=50" \
  -H "Authorization: Bearer w91_live_xxx"
```

### Node.js

```js
const token = process.env.WHATS91_API_TOKEN;

async function listUserBilling() {
  const url = new URL("https://graph.whats91.com/api/v2/billing/messages");
  url.searchParams.set("dateFrom", "2026-06-01");
  url.searchParams.set("limit", "50");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const body = await response.json();
  if (!response.ok || !body.success) {
    throw new Error(body.message || "Failed to fetch billing records");
  }

  return body.data.billingRecords;
}
```

### PHP

```php
<?php
$token = getenv('WHATS91_API_TOKEN');
$url = 'https://graph.whats91.com/api/v2/billing/messages?dateFrom=2026-06-01&limit=50';

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
    throw new RuntimeException($body['message'] ?? 'Failed to fetch billing records');
}

print_r($body['data']['billingRecords']);
```

### Success Response

```json
{
  "success": true,
  "message": "Billing records retrieved",
  "data": {
    "senderId": "919999999999",
    "phoneNumberId": "1234567890",
    "scope": "user",
    "billingRecords": [
      {
        "billingUid": "bill_uid",
        "messageId": "wamid.xxxxx",
        "phoneNumberId": "1234567890",
        "senderPhoneNumber": "919999999999",
        "recipientId": "918888888888",
        "status": "delivered",
        "billable": true,
        "billingClass": "payable",
        "pricingModel": "PMP",
        "pricingCategory": "utility",
        "templateType": "utility",
        "pricingType": "regular",
        "rate": 0.115,
        "conversationId": "conv_xxxxx",
        "conversationOriginType": "utility",
        "messageTimestamp": "2026-06-05T08:00:00.000Z",
        "createdAt": "2026-06-05T08:00:01.000Z",
        "updatedAt": "2026-06-05T08:00:02.000Z"
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

## 2. Number-specific Billing History

Use `GET /api/v2/billing/messages/by-number/{phoneNumberId}` to reconcile billing for one Meta phone number id.

```bash
curl "https://graph.whats91.com/api/v2/billing/messages/by-number/1234567890?limit=50" \
  -H "Authorization: Bearer w91_live_xxx"
```

Equivalent filtering through the main list endpoint:

```bash
curl "https://graph.whats91.com/api/v2/billing/messages?senderId=919999999999&limit=50" \
  -H "Authorization: Bearer w91_live_xxx"
```

## 3. Template-type Billing History

Use `GET /api/v2/billing/messages/by-template-type/{templateType}` to inspect costs by Meta pricing category. `templateType` is the Meta pricing category, not the local template name.

Allowed examples:

- `marketing`
- `utility`
- `authentication`
- `service`

```bash
curl "https://graph.whats91.com/api/v2/billing/messages/by-template-type/utility?dateFrom=2026-06-01" \
  -H "Authorization: Bearer w91_live_xxx"
```

## 4. Delivered Billing Records

Use `GET /api/v2/billing/messages/delivered` to list delivered records. The same result can be requested with `/api/v2/billing/messages?status=delivered`.

```bash
curl "https://graph.whats91.com/api/v2/billing/messages/delivered?limit=50" \
  -H "Authorization: Bearer w91_live_xxx"
```

## 5. Payable Billing Records

Use `GET /api/v2/billing/messages/payable` to list payable billing records. The same result can be requested with `/api/v2/billing/messages?billable=payable`.

```bash
curl "https://graph.whats91.com/api/v2/billing/messages/payable?templateType=utility" \
  -H "Authorization: Bearer w91_live_xxx"
```

## 6. Free Billing Records

Use `GET /api/v2/billing/messages/free` to list free billing records. The same result can be requested with `/api/v2/billing/messages?billable=free`.

```bash
curl "https://graph.whats91.com/api/v2/billing/messages/free?dateFrom=2026-06-01" \
  -H "Authorization: Bearer w91_live_xxx"
```

## 7. Billing Summary

Use `GET /api/v2/billing/summary` to read totals and category breakdowns using the same filters as billing history.

```bash
curl "https://graph.whats91.com/api/v2/billing/summary?dateFrom=2026-06-01&dateTo=2026-06-30" \
  -H "Authorization: Bearer w91_live_xxx"
```

### Summary Response

```json
{
  "success": true,
  "message": "Billing summary retrieved",
  "data": {
    "scope": "user",
    "summary": {
      "totalRecords": 100,
      "deliveredRecords": 91,
      "payableRecords": 80,
      "freeRecords": 20,
      "payableAmount": 92.5,
      "categoryBreakdown": [
        {
          "templateType": "utility",
          "pricingCategory": "utility",
          "totalRecords": 60,
          "deliveredRecords": 56,
          "payableRecords": 50,
          "freeRecords": 10,
          "payableAmount": 40
        }
      ]
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

## 8. Wallet Balance

Use `GET /api/v2/billing/wallet` to read current customer wallet balance and billing account status.

```bash
curl "https://graph.whats91.com/api/v2/billing/wallet" \
  -H "Authorization: Bearer w91_live_xxx"
```

### Wallet Response

```json
{
  "success": true,
  "message": "Wallet retrieved",
  "data": {
    "wallet": {
      "balance": 1250.75,
      "currency": "INR",
      "status": "ACTIVE"
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

## 9. Wallet History

Use `GET /api/v2/billing/wallet/history` to read wallet credit and debit transaction history.

```bash
curl "https://graph.whats91.com/api/v2/billing/wallet/history?transactionType=debit&limit=50" \
  -H "Authorization: Bearer w91_live_xxx"
```

## Error Examples

### Missing or invalid token

```json
{
  "success": false,
  "message": "Invalid auth token",
  "error": {
    "code": "INVALID_AUTH_TOKEN"
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

### Sender not allowed

```json
{
  "success": false,
  "message": "Sender not allowed for this token",
  "error": {
    "code": "SENDER_NOT_ALLOWED"
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
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_FAILED",
    "details": [
      {
        "field": "limit",
        "message": "limit must be between 1 and 200"
      }
    ]
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

## Debugging Checklist

- Confirm the request uses `https://graph.whats91.com/api/v2/billing`, not `/v2/billing`.
- Confirm the bearer token starts with the expected Whats91 public token format, such as `w91_live_`.
- Do not expose the token in frontend JavaScript.
- If using a number-scoped token, do not request another sender's `senderId` or `phoneNumberId`.
- Check `dateFrom` and `dateTo` use `YYYY-MM-DD`.
- Keep `limit` between `1` and `200`.
- Use a valid `templateType`: `marketing`, `utility`, `authentication`, or `service`.
- Use a valid `billable` filter: `true`, `false`, `payable`, or `free`.
- Use `status=delivered` or `/messages/delivered` for delivered-only billing records.
- Use `billable=payable` or `/messages/payable` for payable billing records.
- Use `billable=free` or `/messages/free` for free billing records.
- Keep `metadata.requestId` when contacting support.

## Related Documentation

- Reports API: `/reports`
- Messaging API: `/messaging`
- Webhooks API: `/webhooks`
- Message Billing docs: `/message-billing`
