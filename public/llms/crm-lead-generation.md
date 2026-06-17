# Whats91 CRM Lead Generation API LLM Guide

Use this Markdown brief as implementation context when generating or debugging Whats91 CRM lead creation code.

## Project Context

- API base URL: `https://graph.whats91.com/api/v2`
- Public API version: v2 only.
- CRM leads are company-scoped resources stored in the dedicated Whats91 CRM database.
- Public API authentication still uses Whats91 public API tokens from the main backend.
- Lead Generation supports two canonical routes:
  - `POST /api/v2/crm/leads`
  - `POST /api/v2/crm/companies/{companyUid}/leads`
- Do not expose bearer tokens in frontend code.
- Number-scoped public API tokens are not valid for CRM lead creation and return `TOKEN_SCOPE_NOT_ALLOWED`.

## Endpoint Selection

| Use case | Method | Endpoint | Auth |
| --- | --- | --- | --- |
| Server-side integration with a public API token | POST | `/api/v2/crm/leads` | `Authorization: Bearer w91_public_token_here` |
| Tokenless form or Flow Builder Custom API node | POST | `/api/v2/crm/companies/{companyUid}/leads` | No `Authorization` header |

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

The request body must contain a `lead.fields` object. The bearer-token route must also include `companyUid`.

At least one contact value is required:

- `Email`
- `MobilePhone`
- `Phone`

Unsupported fields are rejected with `VALIDATION_FAILED` so lead data is not silently dropped.

## Bearer-Token Request

```bash
curl -X POST "https://graph.whats91.com/api/v2/crm/leads" \
  -H "Authorization: Bearer w91_public_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "companyUid": "crmco_abc",
    "lead": {
      "fields": {
        "FirstName": "Asha",
        "LastName": "Patel",
        "Company": "Acme Pvt Ltd",
        "Title": "Operations Manager",
        "Email": "asha@example.com",
        "MobilePhone": "919999999999",
        "City": "Indore",
        "State": "Madhya Pradesh",
        "Country": "India",
        "Description": "Needs a CRM follow-up",
        "LeadSourceUid": "crmlsrc_web",
        "StatusUid": "crmlstat_new",
        "Priority": "high",
        "ExternalReferenceId": "sf-lead-1"
      }
    }
  }'
```

## Tokenless Company-URL Request

```bash
curl -X POST "https://graph.whats91.com/api/v2/crm/companies/crmco_abc/leads" \
  -H "Content-Type: application/json" \
  -d '{
    "lead": {
      "fields": {
        "Email": "asha@example.com",
        "MobilePhone": "919999999999",
        "Description": "Lead captured from a Whats91 flow"
      }
    }
  }'
```

## Node.js Example

```javascript
async function createCrmLead({ token, companyUid, fields }) {
  const response = await fetch("https://graph.whats91.com/api/v2/crm/leads", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      companyUid,
      lead: { fields },
    }),
  });

  const body = await response.json();
  if (!response.ok || !body.success) {
    throw new Error(body.message || "Failed to create CRM lead");
  }

  return body.data.lead;
}

await createCrmLead({
  token: process.env.WHATS91_PUBLIC_API_TOKEN,
  companyUid: "crmco_abc",
  fields: {
    FirstName: "Asha",
    LastName: "Patel",
    Email: "asha@example.com",
    MobilePhone: "919999999999",
    Description: "Needs a CRM follow-up",
  },
});
```

## PHP Example

```php
<?php
$token = getenv('WHATS91_PUBLIC_API_TOKEN');

$payload = [
    'companyUid' => 'crmco_abc',
    'lead' => [
        'fields' => [
            'FirstName' => 'Asha',
            'LastName' => 'Patel',
            'Email' => 'asha@example.com',
            'MobilePhone' => '919999999999',
            'Description' => 'Needs a CRM follow-up',
        ],
    ],
];

$ch = curl_init('https://graph.whats91.com/api/v2/crm/leads');
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
curl_close($ch);

$body = json_decode($response, true);
if ($status >= 400 || empty($body['success'])) {
    throw new RuntimeException($body['message'] ?? 'Failed to create CRM lead');
}

print_r($body['data']['lead']);
```

## Request Field Mapping

| Field | CRM mapping | Notes |
| --- | --- | --- |
| `LeadTitle` | `leadTitle` | Optional. Defaults from full name when omitted. |
| `FirstName` | `firstName` | Optional. |
| `LastName` | `lastName` | Optional. |
| `Name` / `FullName` | `fullName` | Optional. If omitted, first and last name are combined. |
| `Company` | `prospectCompanyName` | Optional prospect company name. |
| `Title` | `jobTitle` | Optional job title. |
| `Email` | `email` | Optional, lowercased by CRM validation. |
| `MobilePhone` | `mobileNumber` | Optional mobile number. |
| `Phone` | `alternatePhone` | Optional phone number. Also used for customer matching when `MobilePhone` is absent. |
| `Website` | `website` | Optional website URL or text. |
| `Description` | `requirementSummary` | Optional notes or requirement summary. |
| `LeadSourceUid` | `leadSourceUid` | Optional CRM lead source UID. |
| `StatusUid` | `statusUid` | Optional CRM lead status UID. |
| `OwnerPrincipalKey` | `ownerPrincipalKey` | Optional CRM owner principal key. |
| `Priority` | `priority` | Optional: `low`, `medium`, `high`, or `urgent`. |
| `LeadScore` | `leadScore` | Optional integer. |
| `EstimatedValue` | `estimatedValue` | Optional numeric value. |
| `ExternalReferenceType` | `externalReferenceType` | Optional external system type. |
| `ExternalReferenceId` | `externalReferenceId` | Optional external id. If provided without a type, the type defaults to `public_api`. |

The current CRM lead table does not store Salesforce `CurrencyCode` or `ExpectedClosureDate`; those fields are rejected until the CRM lead schema is extended.

## Automatic Customer Matching

CRM automatically attempts to link the lead to an existing CRM customer in the same company:

- Email matching is exact after normalizing case and surrounding spaces.
- Customer contacts and customer primary email are both checked.
- Phone matching uses `MobilePhone` and `Phone`.
- Phone values are normalized to digits.
- Exact digit matches are checked first across customer mobile and WhatsApp fields.
- Indian numbers also match on the last 10 digits.
- Mobile and WhatsApp numbers are treated equally.

If a match is found, the lead stores the linked CRM customer and possibly the linked CRM customer contact. If no match is found, the lead is still created normally.

## Success Response Shape

```json
{
  "success": true,
  "message": "CRM lead created",
  "data": {
    "lead": {
      "leadUid": "crml_abc",
      "uid": "crml_abc",
      "crmCustomerUid": "crmcust_abc",
      "crmCustomerContactUid": "crmcontact_abc",
      "leadTitle": "Asha Patel",
      "firstName": "Asha",
      "lastName": "Patel",
      "fullName": "Asha Patel",
      "prospectCompanyName": "Acme Pvt Ltd",
      "email": "asha@example.com",
      "mobileNumber": "919999999999",
      "priority": "high",
      "captureMethod": "api",
      "recordStatus": "active",
      "createdAt": "2026-06-16T08:00:00.000Z",
      "updatedAt": "2026-06-16T08:00:00.000Z"
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

Key response fields:

- `success`
- `data.lead.leadUid`
- `data.lead.uid`
- `data.lead.crmCustomerUid`
- `data.lead.crmCustomerContactUid`
- `data.lead.captureMethod`
- `data.lead.recordStatus`
- `metadata.requestId`

Internal database ids, Whats91 user ids, and private token details are never returned.

## Error Codes

| HTTP | Error code | Cause |
| --- | --- | --- |
| 400 | `VALIDATION_FAILED` | Missing `companyUid`, missing `lead.fields`, unsupported field, invalid priority, invalid capture method, or CRM lead validation failure. |
| 401 | `MISSING_AUTH_TOKEN` | Bearer-token route only: no bearer token or compatible token body field was provided. |
| 401 | `INVALID_AUTH_TOKEN` | Bearer-token route only: the public API token is invalid. |
| 403 | `TOKEN_SCOPE_NOT_ALLOWED` | Bearer-token route only: a number-scoped public API token was used. |
| 403 | `CUSTOMER_TOKEN_REQUIRED` | Bearer-token route only: the token does not belong to a customer account. |
| 403 | `FORBIDDEN` | Company-URL route only: the CRM company is inactive. |
| 404 | `NOT_FOUND` | The CRM company or referenced CRM setup row was not found. |

Error body shape:

```json
{
  "success": false,
  "message": "Missing required field: companyUid",
  "error_code": "VALIDATION_FAILED",
  "details": {},
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

## Flow Builder Custom API Setup

Bearer-token CRM lead call:

- Endpoint URL: `https://graph.whats91.com/api/v2/crm/leads`
- Auth Mode: `Bearer token`
- Bearer Token: `{{variables.crm_public_api_token}}`
- Payload template must include `companyUid`.

Tokenless company-URL CRM lead call:

- Endpoint URL: `https://graph.whats91.com/api/v2/crm/companies/crmco_abc/leads`
- Auth Mode: `No auth / URL-based access`
- Bearer Token: leave blank
- Payload template should omit `companyUid`.

## Debugging Checklist

- Confirm the request uses `https://graph.whats91.com/api/v2`.
- For `POST /api/v2/crm/leads`, include `Authorization: Bearer` and `companyUid`.
- For `POST /api/v2/crm/companies/{companyUid}/leads`, do not send an `Authorization` header.
- Confirm the token is a global customer-level public API token, not a number-scoped token.
- Confirm the body contains `lead.fields`.
- Include at least one of `Email`, `MobilePhone`, or `Phone`.
- Use only supported field names from the field mapping table.
- Use a valid `Priority`: `low`, `medium`, `high`, or `urgent`.
- Log `metadata.requestId` for support and troubleshooting.
- Check whether customer matching happened by inspecting `crmCustomerUid` and `crmCustomerContactUid` in the response.

## Related Documentation

- CRM Lead Generation docs: `/crm/lead-generation`
- Authentication docs: `/authentication`
- API Keys docs: `/api-keys`
- Webhook examples: `/webhooks/examples`
- Conversations API: `/conversations`
