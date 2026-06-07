# Whats91 Contact Book API LLM Guide

This Markdown file is a copy-ready implementation brief for LLMs helping developers build or debug Whats91 Contact Book API integrations.

Use this file as context when generating Node.js, PHP, Python, C#, or cURL implementations for listing contact books, reading one book, reading contacts, creating books, updating books, and uploading contacts in bulk.

## Project Context

- Product: Whats91 Developer Public API v2.
- API family: Contact Books.
- Contact Book base URL: `https://graph.whats91.com/api/v2/contact-books`.
- Public v2 only. Do not use internal contact or group routes.
- Contact books are customer-account-wide resources.
- Contact Book APIs require a global public API token.
- Number-scoped public API tokens cannot access contact books and return `TOKEN_SCOPE_NOT_ALLOWED`.
- Bulk upload is JSON-only. CSV and XLSX uploads remain dashboard-only in this API phase.
- Store bearer tokens server-side only. Do not expose tokens in frontend code.

## Authentication

Send a Whats91 global public v2 token in the Authorization header.

```http
Authorization: Bearer w91_public_token_here
Content-Type: application/json
```

Do not use sender-bound or number-scoped tokens for Contact Book APIs. Contact books are not tied to one WhatsApp sender number.

## Endpoint Index

| Use case | Method | Endpoint |
| --- | --- | --- |
| List contact books | GET | `/api/v2/contact-books` |
| Get one contact book | GET | `/api/v2/contact-books/{bookUid}` |
| Get contacts in a book | GET | `/api/v2/contact-books/{bookUid}/contacts` |
| Create contact book | POST | `/api/v2/contact-books` |
| Update contact book | POST | `/api/v2/contact-books/{bookUid}` |
| Bulk upload contacts | POST | `/api/v2/contact-books/{bookUid}/contacts/bulk` |

## Expected Response Fields

Most Contact Book endpoints return:

- `success`: Boolean request result.
- `message`: Human-readable API response message.
- `data.contactBook`: One contact book object where applicable.
- `data.contactBooks`: Contact book list where applicable.
- `data.contacts`: Contact list where applicable.
- `data.items`: Alias for generic paginated clients where applicable.
- `data.pagination`: Pagination metadata for list responses.
- `data.summary`: Bulk upload summary where applicable.
- `data.results`: Row-level bulk upload results where applicable.
- `metadata.apiVersion`: Public API version.
- `metadata.requestId`: Request identifier for support and debugging.

Common contact book fields:

- `contactBookUid`
- `uid`
- `name`
- `description`
- `color`
- `status`
- `contactCount`
- `createdAt`
- `updatedAt`

Common contact fields:

- `contactUid`
- `uid`
- `phone`
- `phoneE164`
- `displayName`
- `email`
- `companyName`
- `status`
- `groups`
- `customFields`

## 1. List Contact Books

Use `GET /api/v2/contact-books` to list account-wide contact books with pagination and filters.

### Query Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `page` | number | No | Positive integer page number. Default `1`. |
| `limit` | number | No | Page size for pagination. Default `50`. |
| `status` | string | No | `ACTIVE` or `INACTIVE`. |
| `search` | string | No | Search by contact book name or description. |

### cURL

```bash
curl -X GET "https://graph.whats91.com/api/v2/contact-books?page=1&limit=50&status=ACTIVE&search=retail" \
  -H "Authorization: Bearer w91_public_token_here"
```

### Node.js

```js
const token = process.env.WHATS91_API_TOKEN;

async function listContactBooks() {
  const url = new URL("https://graph.whats91.com/api/v2/contact-books");
  url.searchParams.set("page", "1");
  url.searchParams.set("limit", "50");
  url.searchParams.set("status", "ACTIVE");
  url.searchParams.set("search", "retail");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const body = await response.json();
  if (!response.ok || !body.success) {
    throw new Error(body.message || "Failed to list contact books");
  }

  return body.data.contactBooks;
}
```

### PHP

```php
<?php
$token = getenv('WHATS91_API_TOKEN');
$url = 'https://graph.whats91.com/api/v2/contact-books?page=1&limit=50&status=ACTIVE&search=retail';

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
    throw new RuntimeException($body['message'] ?? 'Failed to list contact books');
}

print_r($body['data']['contactBooks']);
```

### Success Response

```json
{
  "success": true,
  "message": "Contact books retrieved",
  "data": {
    "contactBooks": [
      {
        "contactBookUid": "grp_abc",
        "uid": "grp_abc",
        "name": "Retail Leads",
        "description": "Retail campaign contacts",
        "color": "#0f62fe",
        "status": "ACTIVE",
        "contactCount": 120,
        "createdAt": "2026-06-06T08:00:00.000Z",
        "updatedAt": "2026-06-06T08:00:00.000Z"
      }
    ],
    "items": [
      {
        "contactBookUid": "grp_abc",
        "uid": "grp_abc",
        "name": "Retail Leads",
        "status": "ACTIVE",
        "contactCount": 120
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

## 2. Get One Contact Book

Use `GET /api/v2/contact-books/{bookUid}` to read one contact book before uploading contacts or building a campaign audience.

```bash
curl -X GET "https://graph.whats91.com/api/v2/contact-books/grp_abc" \
  -H "Authorization: Bearer w91_public_token_here"
```

## 3. Get Contacts In A Book

Use `GET /api/v2/contact-books/{bookUid}/contacts` to inspect contacts linked to a specific contact book.

### Query Parameters

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `bookUid` | string | Yes | Contact book UID, for example `grp_abc`. |
| `page` | number | No | Positive integer page number. Default `1`. |
| `limit` | number | No | Page size for pagination. Default `50`. |
| `search` | string | No | Search by phone, display name, email, or company details. |

```bash
curl -X GET "https://graph.whats91.com/api/v2/contact-books/grp_abc/contacts?page=1&limit=50&search=asha" \
  -H "Authorization: Bearer w91_public_token_here"
```

### Contacts Response

```json
{
  "success": true,
  "message": "Contact book contacts retrieved",
  "data": {
    "contactBook": {
      "contactBookUid": "grp_abc",
      "name": "Retail Leads"
    },
    "contacts": [
      {
        "contactUid": "ct_abc",
        "uid": "ct_abc",
        "phone": "917000782082",
        "phoneE164": "917000782082",
        "displayName": "Asha Rao",
        "email": "asha@example.com",
        "companyName": "Acme",
        "status": "ACTIVE",
        "groups": [
          {
            "uid": "grp_abc",
            "name": "Retail Leads",
            "status": "ACTIVE"
          }
        ],
        "customFields": {
          "city": "Mumbai"
        }
      }
    ],
    "items": [
      {
        "contactUid": "ct_abc",
        "uid": "ct_abc",
        "phone": "917000782082",
        "displayName": "Asha Rao"
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

## 4. Create Contact Book

Use `POST /api/v2/contact-books` to create a new ACTIVE contact book before linking contacts through the bulk upload endpoint.

```bash
curl -X POST "https://graph.whats91.com/api/v2/contact-books" \
  -H "Authorization: Bearer w91_public_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Retail Leads",
    "description": "Retail campaign contacts",
    "color": "#0f62fe"
  }'
```

### Create Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | Yes | Contact book name. |
| `description` | string | No | Short explanation of the book purpose. |
| `color` | string | No | Hex dashboard color, for example `#0f62fe`. |

## 5. Update Contact Book

Use `POST /api/v2/contact-books/{bookUid}` to update the contact book name. Public API update currently changes the contact book name only.

```bash
curl -X POST "https://graph.whats91.com/api/v2/contact-books/grp_abc" \
  -H "Authorization: Bearer w91_public_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Retail Leads Updated"
  }'
```

## 6. Bulk Upload Contacts

Use `POST /api/v2/contact-books/{bookUid}/contacts/bulk` to bulk upload contacts into one contact book using a JSON payload.

```bash
curl -X POST "https://graph.whats91.com/api/v2/contact-books/grp_abc/contacts/bulk" \
  -H "Authorization: Bearer w91_public_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "defaultCountryCode": "91",
    "contacts": [
      {
        "phone": "7000782082",
        "displayName": "Asha Rao",
        "firstName": "Asha",
        "lastName": "Rao",
        "email": "asha@example.com",
        "companyName": "Acme",
        "customFields": {
          "city": "Mumbai"
        }
      }
    ]
  }'
```

### Bulk Upload Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `bookUid` | string | Yes | Contact book UID in the path. |
| `defaultCountryCode` | string | No | Country code used to normalize local phone numbers, for example `91`. |
| `contacts` | array | Yes | Maximum 1000 contacts per request. |
| `contacts[].phone` | string | Yes | Contact phone number. |
| `contacts[].displayName` | string | No | Readable contact name. |
| `contacts[].firstName` | string | No | Optional first name. |
| `contacts[].lastName` | string | No | Optional last name. |
| `contacts[].email` | string | No | Optional email address. |
| `contacts[].companyName` | string | No | Optional company name. |
| `contacts[].customFields` | object | No | Developer-defined metadata. |

### Bulk Upload Behavior

- Maximum 1000 contacts per request.
- Phone numbers are normalized using `defaultCountryCode`.
- Existing contacts are updated and linked to the contact book.
- New contacts are created and linked to the contact book.
- Duplicate numbers inside the same request are skipped with `DUPLICATE_IN_REQUEST`.
- Invalid rows do not fail the whole request; they are returned in row-level results.

### Bulk Upload Response

```json
{
  "success": true,
  "message": "Contacts uploaded",
  "data": {
    "contactBook": {
      "contactBookUid": "grp_abc",
      "name": "Retail Leads"
    },
    "summary": {
      "total": 3,
      "created": 1,
      "updated": 1,
      "skipped": 1,
      "invalid": 0
    },
    "results": [
      {
        "row": 1,
        "status": "UPDATED",
        "contact": {
          "contactUid": "ct_existing",
          "phone": "917000782082"
        }
      },
      {
        "row": 2,
        "status": "CREATED",
        "contact": {
          "contactUid": "ct_new",
          "phone": "917999999999"
        }
      },
      {
        "row": 3,
        "status": "SKIPPED",
        "reason": "DUPLICATE_IN_REQUEST",
        "phone": "917999999999"
      }
    ]
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

## Error Examples

### Number-scoped token

```json
{
  "success": false,
  "error": {
    "code": "TOKEN_SCOPE_NOT_ALLOWED",
    "message": "Contact books require a global public API token."
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

### Contact book not found

```json
{
  "success": false,
  "error": {
    "code": "CONTACT_BOOK_NOT_FOUND",
    "message": "Contact book UID does not belong to the authenticated customer."
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
    "message": "Invalid pagination, missing or long name, invalid contacts payload, too many contacts, or invalid custom fields."
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
| 401 | `INVALID_AUTH_TOKEN` | Token is invalid, expired, revoked, or user inactive. |
| 403 | `TOKEN_SCOPE_NOT_ALLOWED` | Token is number-scoped; contact books require a global token. |
| 403 | `FEATURE_NOT_AVAILABLE` | Customer subscription does not include contacts. |
| 400 | `VALIDATION_FAILED` | Invalid pagination, missing or long name, invalid contacts payload, too many contacts, or invalid custom fields. |
| 404 | `CONTACT_BOOK_NOT_FOUND` | Contact book UID does not belong to the authenticated customer. |
| 415 | `UNSUPPORTED_CONTENT_TYPE` | POST request is not JSON. |

## Debugging Checklist

- Confirm the request uses `https://graph.whats91.com/api/v2/contact-books`.
- Use a global public API token, not a number-scoped token.
- Send `Authorization: Bearer w91_public_token_here` on every request.
- Send `Content-Type: application/json` on POST requests.
- Keep tokens server-side only.
- Use `bookUid` values returned as `contactBookUid` or `uid`.
- For list endpoints, keep `page` and `limit` positive.
- For create requests, include `name`.
- For update requests, include the replacement `name`.
- For bulk upload, include a `contacts` array with no more than 1000 rows.
- For bulk upload, each row must include `phone`.
- Use `defaultCountryCode` when sending local phone numbers.
- Store row-level upload results because invalid rows do not fail the entire request.
- Preserve `metadata.requestId` when contacting support.

## Related Documentation

- Messaging API: `/messaging`
- Templates API: `/templates`
- Reports API: `/reports`
- Contact Book docs: `/contact-books`
