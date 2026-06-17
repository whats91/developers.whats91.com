# Whats91 CRM Complaint Creation API LLM Guide

Use this Markdown brief as implementation context when generating or debugging Whats91 CRM complaint creation code.

## Project Context

- API base URL: `https://graph.whats91.com/api/v2`
- Public API version: v2 only.
- CRM complaints are company-scoped resources stored in the dedicated Whats91 CRM database.
- Public API authentication still uses Whats91 public API tokens from the main backend.
- Complaint Creation supports two canonical routes:
  - `POST /api/v2/crm/complaints`
  - `POST /api/v2/crm/companies/{companyUid}/complaints`
- Do not expose bearer tokens in frontend code.
- Number-scoped public API tokens are not valid for CRM complaint creation and return `TOKEN_SCOPE_NOT_ALLOWED`.

## Endpoint Selection

| Use case | Method | Endpoint | Auth |
| --- | --- | --- | --- |
| Server-side integration with a public API token | POST | `/api/v2/crm/complaints` | `Authorization: Bearer w91_public_token_here` |
| Tokenless complaint form or Flow Builder Custom API node | POST | `/api/v2/crm/companies/{companyUid}/complaints` | No `Authorization` header |

Use the bearer-token route when your backend can safely store and send a public API token.

Use the company-URL route only when the integration cannot send an auth header. The `companyUid` in the URL is authoritative, and the request body can omit `companyUid`.

## Authentication

Bearer-token route:

```http
Authorization: Bearer w91_public_token_here
Content-Type: application/json
```

For POST compatibility, `authToken`, `auth_token`, or `token` can also be sent in the JSON body. The bearer token takes precedence when both are present.

Tokenless company-URL route:

```http
Content-Type: application/json
```

Do not send an `Authorization` header to the company-URL route.

## Required Request Shape

The request body must contain a `complaint.fields` object. The bearer-token route must also include `companyUid`.

Required complaint fields:

- `ComplaintTitle`, `Subject`, or `Title`
- `Description`, `Message`, or `Issue`

Unsupported fields are rejected with `VALIDATION_FAILED` so complaint data is not silently dropped.

## Bearer-Token Request

```bash
curl -X POST "https://graph.whats91.com/api/v2/crm/complaints" \
  -H "Authorization: Bearer w91_public_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "companyUid": "crmco_abc",
    "complaint": {
      "fields": {
        "ComplaintTitle": "WhatsApp API is not working",
        "Description": "Customer reports API failures since morning.",
        "CustomerName": "Dev Test",
        "Email": "person@example.com",
        "MobilePhone": "919999999999",
        "CategoryUid": "crmccat_general",
        "PriorityUid": "crmcp_low",
        "ExternalReferenceId": "flow-ticket-1001"
      }
    }
  }'
```

## Tokenless Company-URL Request

```bash
curl -X POST "https://graph.whats91.com/api/v2/crm/companies/crmco_abc/complaints" \
  -H "Content-Type: application/json" \
  -d '{
    "complaint": {
      "fields": {
        "Subject": "Billing issue",
        "Message": "Invoice total does not match the order.",
        "Phone": "+91 99999 99999"
      }
    }
  }'
```

## Node.js Example

```javascript
async function createCrmComplaint({ token, companyUid, fields }) {
  const response = await fetch("https://graph.whats91.com/api/v2/crm/complaints", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      companyUid,
      complaint: { fields },
    }),
  });

  const body = await response.json();
  if (!response.ok || !body.success) {
    throw new Error(body.message || "Failed to create CRM complaint");
  }

  return body.data.complaint;
}

await createCrmComplaint({
  token: process.env.WHATS91_PUBLIC_API_TOKEN,
  companyUid: "crmco_abc",
  fields: {
    ComplaintTitle: "WhatsApp API is not working",
    Description: "Customer reports API failures since morning.",
    Email: "person@example.com",
    MobilePhone: "919999999999",
    ExternalReferenceId: "flow-ticket-1001",
  },
});
```

## PHP Example

```php
<?php
$token = getenv('WHATS91_PUBLIC_API_TOKEN');

$payload = [
    'companyUid' => 'crmco_abc',
    'complaint' => [
        'fields' => [
            'ComplaintTitle' => 'WhatsApp API is not working',
            'Description' => 'Customer reports API failures since morning.',
            'Email' => 'person@example.com',
            'MobilePhone' => '919999999999',
            'ExternalReferenceId' => 'flow-ticket-1001',
        ],
    ],
];

$ch = curl_init('https://graph.whats91.com/api/v2/crm/complaints');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode($payload),
]);

$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$requestId = curl_getinfo($ch, CURLINFO_HEADER_OUT);
curl_close($ch);

$body = json_decode($response, true);
if ($status >= 400 || empty($body['success'])) {
    throw new RuntimeException($body['message'] ?? 'Failed to create CRM complaint');
}

print_r($body['data']['complaint']);
```

## Supported Field Mapping

| Field | CRM mapping |
| --- | --- |
| `ComplaintTitle`, `Subject`, `Title` | `complaintTitle` |
| `Description`, `Message`, `Issue` | `description` |
| `CustomerName`, `Name` | `submittedCustomerName` |
| `Company`, `CompanyName` | `submittedCompanyName` |
| `Email` | `submittedEmail` |
| `MobilePhone`, `MobileNumber`, `Phone` | `submittedMobileNumber` |
| `Address` | `submittedAddress` |
| `SourceUid`, `ComplaintSourceUid` | `sourceUid` |
| `StatusUid` | `statusUid` |
| `PriorityUid` | `priorityUid` |
| `CategoryUid` | `categoryUid` |
| `QueueUid` | `queueUid` |
| `AssigneePrincipalKey` | `assigneePrincipalKey` |
| `ExternalReferenceType` | `externalReferenceType` |
| `ExternalReferenceId` | `externalReferenceId` |
| `RelatedOrderReference` | `relatedOrderReference` |
| `NextFollowUpAt` | `nextFollowUpAt` |

If `ExternalReferenceId` is provided without `ExternalReferenceType`, the type defaults to `public_api`.

Public complaints are saved with `intakeMethod: "api"`.

## Customer Matching

CRM automatically attempts to link the complaint to an existing account or contact in the same company:

- Email matching is exact after trimming and lowercasing.
- Phone values are normalized to digits before matching.
- Mobile and WhatsApp numbers are treated equally.
- For India, CRM also matches the last 10 digits so values with or without `+91` resolve to the same customer.
- If no customer is found, the complaint is still created normally.

## Success Response Shape

```json
{
  "success": true,
  "message": "CRM complaint created",
  "data": {
    "complaint": {
      "complaintUid": "crmc_abc",
      "uid": "crmc_abc",
      "complaintNumber": "CMP-00001",
      "complaintTitle": "WhatsApp API is not working",
      "description": "Customer reports API failures since morning.",
      "submittedEmail": "person@example.com",
      "submittedMobileNumber": "919999999999",
      "intakeMethod": "api",
      "source": {
        "sourceUid": "crmcs_api",
        "uid": "crmcs_api",
        "name": "API"
      },
      "status": {
        "statusUid": "crmcst_open",
        "uid": "crmcst_open",
        "name": "Open"
      },
      "recordStatus": "active",
      "createdAt": "2026-06-16T08:30:00.000Z",
      "updatedAt": "2026-06-16T08:30:00.000Z"
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

Response headers:

- `X-Whats91-Request-Id`
- `X-Whats91-Crm-Complaint-Uid`

Key response fields:

- `success`
- `data.complaint.complaintUid`
- `data.complaint.uid`
- `data.complaint.complaintNumber`
- `data.complaint.intakeMethod`
- `data.complaint.recordStatus`
- `metadata.requestId`

Internal database ids, Whats91 user ids, tokens, encrypted values, and raw private payloads are never returned.

## Error Codes

| HTTP | Error code | Cause |
| --- | --- | --- |
| 400 | `VALIDATION_FAILED` | Missing `companyUid`, missing `complaint.fields`, missing title/description, unsupported field, or CRM complaint validation failure. |
| 401 | `MISSING_AUTH_TOKEN` | Bearer-token route only: no bearer token or compatible token body field was provided. |
| 401 | `INVALID_AUTH_TOKEN` | Bearer-token route only: the public API token is invalid. |
| 403 | `TOKEN_SCOPE_NOT_ALLOWED` | Bearer-token route only: a number-scoped public API token was used. |
| 403 | `CUSTOMER_TOKEN_REQUIRED` | Bearer-token route only: the token does not belong to a customer account. |
| 403 | `FORBIDDEN` | Company-URL route only: the CRM company is inactive or unavailable for public access. |
| 404 | `NOT_FOUND` | The CRM company or referenced CRM setup row was not found. |

Error body shape:

```json
{
  "success": false,
  "message": "Complaint title and description are required",
  "error_code": "VALIDATION_FAILED",
  "details": {},
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

## Debugging Checklist

- Confirm the request uses `https://graph.whats91.com/api/v2`.
- For `POST /api/v2/crm/complaints`, include `Authorization: Bearer` and `companyUid`.
- For `POST /api/v2/crm/companies/{companyUid}/complaints`, do not send an `Authorization` header.
- Confirm the token is a global customer-level public API token, not a number-scoped token.
- Confirm the body contains `complaint.fields`.
- Include `ComplaintTitle` or a title alias.
- Include `Description` or a description alias.
- Use only supported field names from the field mapping table.
- Log `metadata.requestId` and `X-Whats91-Crm-Complaint-Uid` for support and troubleshooting.
- Check whether customer matching happened from CRM complaint context in your dashboard or downstream CRM workflow.

## Related Documentation

- CRM Complaint Creation docs: `/crm/complaint-creation`
- CRM Lead Generation docs: `/crm/lead-generation`
- Authentication docs: `/authentication`
- API Keys docs: `/api-keys`
- Webhook examples: `/webhooks/examples`
