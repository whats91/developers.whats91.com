# Whats91 Template API LLM Guide

Use this Markdown brief as implementation context for LLMs that need to generate or debug Whats91 WhatsApp template creation code.

## Project Context

- Product: Whats91 Developer Docs.
- API family: Public API v2 only.
- Base URL: `https://graph.whats91.com/api/v2`.
- Template endpoint: `POST /api/v2/templates`.
- Full URL: `https://graph.whats91.com/api/v2/templates`.
- Supported template categories: `MARKETING`, `UTILITY`, and `AUTHENTICATION`.
- Sender selection uses `senderId`, which is the WhatsApp sender phone number.
- If a token is number-scoped or resolves one default sender, `senderId` can be omitted.
- Template submissions are validated by Whats91, stored locally, and submitted to Meta for review.
- Delivery of created templates happens later through Messaging APIs after approval.

## Authentication

Use server-side bearer token authentication.

```http
Authorization: Bearer w91_live_xxx
Content-Type: application/json
```

Do not expose Whats91 bearer tokens in browser or mobile frontend code. Call Whats91 from a trusted backend service.

Compatibility body fields such as `authToken`, `auth_token`, or `token` can be accepted by some clients, but the recommended approach is the `Authorization` header.

## Core Request Shape

```json
{
  "senderId": "916268662275",
  "template": {
    "name": "template_name_v1",
    "category": "MARKETING",
    "language": "en",
    "body": {
      "text": "Hello {{1}}, your message text goes here.",
      "examples": ["Devendar"]
    },
    "header": {
      "type": "TEXT",
      "text": "Header text"
    },
    "footer": {
      "text": "Footer text"
    },
    "buttons": [],
    "metadata": {
      "clientReferenceId": "internal-reference"
    }
  }
}
```

## Required Fields

- `template.name`: Unique template name. Whats91 normalizes names to lowercase snake_case where applicable.
- `template.category`: One of `MARKETING`, `UTILITY`, or `AUTHENTICATION`.
- `template.language`: Language code such as `en`.
- `template.body.text`: Required for MARKETING and UTILITY templates.
- `template.body.examples`: Required when body text contains variables such as `{{1}}`.
- `template.buttons[0].type`: Required for AUTHENTICATION templates. Use `COPY_CODE`.
- `template.buttons[0].example`: Required for AUTHENTICATION templates. Example OTP such as `123456`.

## Optional Fields

- `senderId`: WhatsApp sender number, optional when token scope resolves the sender.
- `template.header`: Optional for MARKETING and UTILITY. Supports `TEXT`, `IMAGE`, `VIDEO`, or `DOCUMENT`.
- `template.header.mediaUrl`: Public HTTPS media URL for media headers.
- `mediaFile`: Multipart local media upload for media headers.
- `template.footer.text`: Optional short footer text.
- `template.buttons`: Optional URL, PHONE_NUMBER, QUICK_REPLY, or COPY_CODE buttons depending on category.
- `template.metadata`: Local Whats91 metadata, not sent to Meta.

## Response Shape

Successful responses include template identifiers and Meta submission status.

```json
{
  "success": true,
  "message": "Template submitted to Meta",
  "data": {
    "templateUid": "0e6fb4f1-5a60-4d1d-8ef2-61a6ec8b7103",
    "templateId": "w91_1780300000000_ab12cd34",
    "templateName": "festival_offer_v1",
    "normalizedTemplateName": "festival_offer_v1",
    "category": "MARKETING",
    "language": "en",
    "status": "PENDING",
    "senderId": "916268662275",
    "phoneNumberId": "1043189608869917",
    "wabaId": "643703032991069",
    "metaSubmission": {
      "submitted": true,
      "status": "PENDING",
      "metaTemplateId": "1234567890"
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid",
    "processingTimeMs": 320
  }
}
```

## Error Response Examples

Template name already exists:

```json
{
  "success": false,
  "message": "Template name already exists",
  "error_code": "TEMPLATE_NAME_EXISTS",
  "details": {
    "templateName": "festival_offer_v1",
    "normalizedTemplateName": "festival_offer_v1",
    "templateUid": "existing-template-uid",
    "status": "APPROVED"
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

Meta submission failed:

```json
{
  "success": false,
  "message": "Meta rejected template body",
  "error_code": "META_TEMPLATE_SUBMISSION_FAILED",
  "details": {
    "templateUid": "0e6fb4f1-5a60-4d1d-8ef2-61a6ec8b7103",
    "templateName": "festival_offer_v1",
    "meta": {
      "message": "Meta rejected template body",
      "code": 100,
      "subcode": 2388040
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}
```

## Flow 1: Create a MARKETING Template

Use MARKETING templates for offers, promotions, launches, events, coupons, and customer engagement.

```bash
curl -X POST "https://graph.whats91.com/api/v2/templates" \
  -H "Authorization: Bearer w91_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "916268662275",
    "template": {
      "name": "festival_offer_v1",
      "category": "MARKETING",
      "language": "en",
      "body": {
        "text": "Hello {{1}}, our festive offer is live. Save {{2}} until {{3}}.",
        "examples": ["Devendar", "20%", "Sunday"]
      },
      "header": { "type": "TEXT", "text": "Festive offer" },
      "footer": { "text": "Whats91" },
      "buttons": [
        {
          "type": "URL",
          "text": "Shop now",
          "url": "https://example.com/offers"
        }
      ],
      "metadata": {
        "clientReferenceId": "campaign-festival-2026"
      }
    }
  }'
```

## Flow 2: Create a UTILITY Template

Use UTILITY templates for account, order, invoice, appointment, ticket, and service updates.

```bash
curl -X POST "https://graph.whats91.com/api/v2/templates" \
  -H "Authorization: Bearer w91_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "916268662275",
    "template": {
      "name": "payment_reminder_v1",
      "category": "UTILITY",
      "language": "en",
      "body": {
        "text": "Hello {{1}}, payment for invoice {{2}} is due on {{3}}.",
        "examples": ["Devendar", "INV-1001", "31 March"]
      },
      "buttons": [
        {
          "type": "URL",
          "text": "Pay now",
          "url": "https://example.com/pay/{{1}}",
          "example": "https://example.com/pay/INV-1001"
        }
      ]
    }
  }'
```

## Flow 3: Create an AUTHENTICATION Template

Use AUTHENTICATION templates for OTP, login verification, account recovery, and transaction confirmation.

Authentication templates should not include URLs, emojis, headers, footers, or non-copy-code buttons. Use one `COPY_CODE` button with an example code.

```bash
curl -X POST "https://graph.whats91.com/api/v2/templates" \
  -H "Authorization: Bearer w91_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "916268662275",
    "template": {
      "name": "login_otp_v1",
      "category": "AUTHENTICATION",
      "language": "en",
      "buttons": [
        { "type": "COPY_CODE", "example": "123456" }
      ],
      "metadata": {
        "clientReferenceId": "auth-login-template"
      }
    }
  }'
```

## Node.js Example

```js
const token = process.env.WHATS91_API_TOKEN;

async function createTemplate(template) {
  const response = await fetch('https://graph.whats91.com/api/v2/templates', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(template),
  });

  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'Template creation failed');
  }

  return payload;
}

await createTemplate({
  senderId: '916268662275',
  template: {
    name: 'shipping_update_v1',
    category: 'UTILITY',
    language: 'en',
    body: {
      text: 'Hello {{1}}, your order {{2}} has shipped.',
      examples: ['Devendar', 'ORD-1001'],
    },
  },
});
```

## PHP cURL Example

```php
<?php
$token = getenv('WHATS91_API_TOKEN');

$payload = [
    'senderId' => '916268662275',
    'template' => [
        'name' => 'signup_otp_v1',
        'category' => 'AUTHENTICATION',
        'language' => 'en',
        'buttons' => [
            ['type' => 'COPY_CODE', 'example' => '123456'],
        ],
    ],
];

$ch = curl_init('https://graph.whats91.com/api/v2/templates');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode($payload),
]);

$raw = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$response = json_decode($raw, true);

if ($status >= 400 || empty($response['success'])) {
    throw new RuntimeException($response['message'] ?? 'Template creation failed');
}

print_r($response);
```

## Practical Template Examples

### MARKETING: Coupon Offer

```json
{
  "template": {
    "name": "coupon_offer_v1",
    "category": "MARKETING",
    "language": "en",
    "body": {
      "text": "Hi {{1}}, use coupon {{2}} to save {{3}} today.",
      "examples": ["Devendar", "SAVE20", "20%"]
    },
    "buttons": [
      { "type": "URL", "text": "Apply coupon", "url": "https://example.com/coupons" }
    ]
  }
}
```

### MARKETING: Product Launch

```json
{
  "template": {
    "name": "product_launch_v1",
    "category": "MARKETING",
    "language": "en",
    "header": { "type": "IMAGE", "mediaUrl": "https://example.com/launch.jpg" },
    "body": {
      "text": "{{1}} is now live. Explore new features built for {{2}}.",
      "examples": ["Whats91 Campaigns", "business messaging"]
    }
  }
}
```

### UTILITY: Order Update

```json
{
  "template": {
    "name": "order_update_v1",
    "category": "UTILITY",
    "language": "en",
    "body": {
      "text": "Your order {{1}} is now {{2}}.",
      "examples": ["ORD-1001", "out for delivery"]
    }
  }
}
```

### UTILITY: Appointment Reminder

```json
{
  "template": {
    "name": "appointment_reminder_v1",
    "category": "UTILITY",
    "language": "en",
    "body": {
      "text": "Reminder: your appointment is scheduled for {{1}} at {{2}}.",
      "examples": ["Monday", "11:00 AM"]
    }
  }
}
```

### AUTHENTICATION: Login OTP

```json
{
  "template": {
    "name": "login_otp_v1",
    "category": "AUTHENTICATION",
    "language": "en",
    "buttons": [
      { "type": "COPY_CODE", "example": "123456" }
    ]
  }
}
```

### AUTHENTICATION: Password Reset Code

```json
{
  "template": {
    "name": "password_reset_code_v1",
    "category": "AUTHENTICATION",
    "language": "en",
    "buttons": [
      { "type": "COPY_CODE", "example": "654321" }
    ]
  }
}
```

## Debugging Checklist

- Confirm `Authorization: Bearer w91_live_xxx` is present.
- Confirm the token is active and scoped to the correct WhatsApp sender.
- Include `senderId` when the token cannot resolve a default sender.
- Use `POST /api/v2/templates`, not a Messaging send endpoint.
- Use the correct category: `MARKETING`, `UTILITY`, or `AUTHENTICATION`.
- Keep template names unique per sender.
- Use lowercase snake_case names to avoid normalization surprises.
- Provide `template.body.examples` for every body placeholder.
- Do not use unsupported button types for the selected category.
- For AUTHENTICATION, use only one `COPY_CODE` button.
- Do not include media headers in AUTHENTICATION templates.
- For media headers, use a public HTTPS `mediaUrl` or multipart `mediaFile`.
- Check `metadata.requestId` when contacting support.
- Check `data.status`; new templates are commonly returned as `PENDING` until Meta review completes.

## Related Docs

- Messaging API: `/messaging`
- Marketing Templates: `/templates/marketing`
- Utility Templates: `/templates/utility`
- Authentication Templates: `/templates/authentication`
- Webhooks: `/webhooks`
- Reports: `/reports`
