// =============================================================================
// Whats91 Documentation — Content Data Store
// Design tokens: brand green #00d4a4, code bg #1c1c1e, hairline #e5e5e5,
//   steel text #5a5a5c, muted text #888888
// =============================================================================

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

export interface CodeBlock {
  language: string
  code: string
  label?: string
}

export interface ApiParameter {
  name: string
  type: string
  required: boolean
  description: string
}

export interface ApiExample {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
  description?: string
  request?: CodeBlock[]
  response?: CodeBlock[]
  parameters?: ApiParameter[]
}

export interface InfoCard {
  title: string
  value?: string
  description: string
  tone?: 'green' | 'blue' | 'amber' | 'red' | 'slate'
}

export interface DocFaq {
  question: string
  answer: string
}

export interface ContentBlock {
  type: 'heading' | 'paragraph' | 'code' | 'api' | 'callout' | 'table' | 'list' | 'cards' | 'divider'
  level?: number // heading level 1-4
  text?: string
  language?: string
  code?: string
  label?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint?: string
  request?: CodeBlock[]
  response?: CodeBlock[]
  parameters?: ApiParameter[]
  variant?: 'info' | 'warning' | 'tip' | 'danger'
  items?: string[]
  ordered?: boolean
  cards?: InfoCard[]
  headers?: string[]
  rows?: string[][]
}

export interface DocSectionData {
  id: string
  title: string
  slug: string
  description: string
  summary?: string
  prerequisites?: string[]
  faqs?: DocFaq[]
  seoTitle?: string
  seoDescription?: string
  relatedSectionIds?: string[]
  category: string
  icon?: string
  content: ContentBlock[]
}

export interface DocCategoryData {
  id: string
  label: string
  slug: string
  icon: string
  sections: { id: string; title: string; slug: string }[]
}

export interface ChangelogEntry {
  date: string
  version: string
  title: string
  type: 'feature' | 'improvement' | 'fix' | 'breaking'
  description: string
}

// ---------------------------------------------------------------------------
// Navigation categories
// ---------------------------------------------------------------------------

export const docCategories: DocCategoryData[] = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    slug: 'getting-started',
    icon: 'Rocket',
    sections: [
      { id: 'overview', title: 'Overview', slug: 'overview' },
      { id: 'quick-start', title: 'Quick Start', slug: 'quick-start' },
      { id: 'authentication', title: 'Authentication', slug: 'authentication' },
      { id: 'api-keys', title: 'API Keys', slug: 'api-keys' },
      { id: 'rate-limits', title: 'Rate Limits', slug: 'rate-limits' },
    ],
  },
  {
    id: 'messaging',
    label: 'Messaging',
    slug: 'messaging',
    icon: 'MessageSquare',
    sections: [
      { id: 'messaging-overview', title: 'Overview', slug: 'overview' },
      { id: 'messaging-template-send', title: 'Template Send', slug: 'template-send' },
      { id: 'messaging-chat-text', title: 'Chat Text', slug: 'chat-text' },
      { id: 'messaging-chat-media', title: 'Chat Media', slug: 'chat-media' },
      { id: 'messaging-chat-interactive', title: 'Chat Interactive', slug: 'chat-interactive' },
    ],
  },
  {
    id: 'messaging-meta',
    label: 'Messaging Meta-Compatibility',
    slug: 'messaging-meta',
    icon: 'Code2',
    sections: [
      { id: 'messaging-meta-overview', title: 'Overview', slug: 'overview' },
      { id: 'messaging-meta-text', title: 'Text', slug: 'text' },
      { id: 'messaging-meta-template', title: 'Template', slug: 'template' },
      { id: 'messaging-meta-media', title: 'Media', slug: 'media' },
      { id: 'messaging-meta-interactive', title: 'Interactive', slug: 'interactive' },
      { id: 'messaging-meta-errors', title: 'Responses & Errors', slug: 'responses-errors' },
    ],
  },
  {
    id: 'template',
    label: 'Template',
    slug: 'template',
    icon: 'FileText',
    sections: [
      { id: 'template-marketing', title: 'Marketing', slug: 'marketing' },
      { id: 'template-utility', title: 'Utility', slug: 'utility' },
      { id: 'template-authentication', title: 'Authentication', slug: 'authentication' },
    ],
  },
  {
    id: 'webhook',
    label: 'Webhook',
    slug: 'webhook',
    icon: 'Webhook',
    sections: [
      { id: 'webhook-create', title: 'Create', slug: 'create' },
      { id: 'webhook-samples', title: 'Samples', slug: 'samples' },
      { id: 'webhook-examples', title: 'Examples', slug: 'examples' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    slug: 'reports',
    icon: 'BarChart3',
    sections: [
      { id: 'reports-all', title: 'All Reports', slug: 'all-reports' },
      { id: 'reports-message-status', title: 'Message Status', slug: 'message-status' },
      { id: 'reports-mobile-history', title: 'Mobile History', slug: 'mobile-history' },
      { id: 'reports-campaigns', title: 'Campaigns', slug: 'campaigns' },
      { id: 'reports-campaign-detail', title: 'Campaign Detail', slug: 'campaign-detail' },
      { id: 'reports-campaign-messages', title: 'Campaign Messages', slug: 'campaign-messages' },
      { id: 'reports-campaign-timeline', title: 'Campaign Timeline', slug: 'campaign-timeline' },
      { id: 'reports-campaign-responses', title: 'Campaign Responses', slug: 'campaign-responses' },
      { id: 'reports-delivery-analytics', title: 'Delivery Analytics', slug: 'delivery-analytics' },
      { id: 'reports-failure-analytics', title: 'Failure Analytics', slug: 'failure-analytics' },
      { id: 'reports-template-analytics', title: 'Template Analytics', slug: 'template-analytics' },
      { id: 'reports-date-analytics', title: 'Date Analytics', slug: 'date-analytics' },
    ],
  },
  {
    id: 'message-billing',
    label: 'Message Billing',
    slug: 'message-billing',
    icon: 'CreditCard',
    sections: [
      { id: 'billing-user-history', title: 'User History', slug: 'user-history' },
      { id: 'billing-number-history', title: 'Number History', slug: 'number-history' },
      { id: 'billing-template-type', title: 'Template Type', slug: 'template-type' },
      { id: 'billing-delivered', title: 'Delivered', slug: 'delivered' },
      { id: 'billing-payable', title: 'Payable', slug: 'payable' },
      { id: 'billing-free', title: 'Free', slug: 'free' },
      { id: 'billing-summary', title: 'Summary', slug: 'summary' },
      { id: 'billing-wallet', title: 'Wallet', slug: 'wallet' },
      { id: 'billing-wallet-history', title: 'Wallet History', slug: 'wallet-history' },
    ],
  },
  {
    id: 'chatbot',
    label: 'Chatbot',
    slug: 'chatbot',
    icon: 'Bot',
    sections: [
      { id: 'chatbot-list', title: 'List Chatbots', slug: 'list' },
      { id: 'chatbot-get', title: 'Get Chatbot', slug: 'get' },
      { id: 'chatbot-create', title: 'Create Chatbot', slug: 'create' },
      { id: 'chatbot-text', title: 'Text Chatbot', slug: 'text' },
      { id: 'chatbot-media', title: 'Media Chatbot', slug: 'media' },
      { id: 'chatbot-interactive', title: 'Interactive Chatbot', slug: 'interactive' },
    ],
  },
  {
    id: 'contact-book',
    label: 'Contact Book',
    slug: 'contact-book',
    icon: 'BookUser',
    sections: [
      { id: 'contact-book-list', title: 'List Books', slug: 'list' },
      { id: 'contact-book-get', title: 'Get Book', slug: 'get' },
      { id: 'contact-book-contacts', title: 'Get Contacts', slug: 'contacts' },
      { id: 'contact-book-create', title: 'Create Book', slug: 'create' },
      { id: 'contact-book-update', title: 'Update Book', slug: 'update' },
      { id: 'contact-book-upload', title: 'Upload Contacts', slug: 'upload' },
    ],
  },
  {
    id: 'blacklist',
    label: 'Blacklist',
    slug: 'blacklist',
    icon: 'Ban',
    sections: [
      { id: 'blacklist-list', title: 'List Entries', slug: 'list' },
      { id: 'blacklist-get', title: 'Get Entry', slug: 'get' },
      { id: 'blacklist-add', title: 'Add Number', slug: 'add' },
      { id: 'blacklist-update', title: 'Update Entry', slug: 'update' },
      { id: 'blacklist-delete', title: 'Delete Entry', slug: 'delete' },
    ],
  },
  {
    id: 'conversations',
    label: 'Conversations',
    slug: 'conversations',
    icon: 'MessageCircle',
    sections: [
      { id: 'conversations-list', title: 'List Conversations', slug: 'list' },
      { id: 'conversations-summary', title: 'Summary', slug: 'summary' },
      { id: 'conversations-by-mobile', title: 'By Mobile', slug: 'by-mobile' },
      { id: 'conversations-get', title: 'Get Conversation', slug: 'get' },
      { id: 'conversations-messages', title: 'Messages', slug: 'messages' },
    ],
  },
  {
    id: 'crm',
    label: 'CRM',
    slug: 'crm',
    icon: 'UsersRound',
    sections: [
      { id: 'crm-lead-generation', title: 'Lead Generation', slug: 'lead-generation' },
      { id: 'crm-complaint-creation', title: 'Complaint Creation', slug: 'complaint-creation' },
    ],
  },
  {
    id: 'changelog',
    label: 'Changelog',
    slug: 'changelog',
    icon: 'GitCommitHorizontal',
    sections: [
      { id: 'changelog', title: 'Changelog', slug: 'changelog' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Flat section lookup
// ---------------------------------------------------------------------------

export function getSectionById(id: string): DocSectionData | undefined {
  return docSections.find((s) => s.id === id)
}

export function getCategoryForSection(sectionId: string): DocCategoryData | undefined {
  return docCategories.find((cat) => cat.sections.some((s) => s.id === sectionId))
}

type DocSectionEnhancement = {
  summary: string
  prerequisites?: string[]
  seoTitle: string
  seoDescription: string
  relatedSectionIds?: string[]
  faqs: DocFaq[]
}

const sectionEnhancements: Record<string, DocSectionEnhancement> = {
  'overview': {
    summary: 'Use this page to understand the Whats91 public API v2 surface, canonical base URL, supported API families, and how Whats91 routes WhatsApp Cloud API requests for developers.',
    prerequisites: ['A Whats91 account', 'At least one connected WhatsApp sender for production sends'],
    seoTitle: 'WhatsApp Business API Documentation | Whats91 Developer Platform',
    seoDescription: 'Official Whats91 Developer Documentation for WhatsApp Cloud API integrations, messaging APIs, templates, webhooks, reports, chatbots, and Meta-compatible endpoints.',
    relatedSectionIds: ['quick-start', 'authentication', 'messaging-overview', 'template-marketing'],
    faqs: [
      {
        question: 'What is Whats91?',
        answer: 'Whats91 is a developer platform for WhatsApp Business API workflows, including messaging, templates, webhooks, reports, chatbots, billing, contact books, and blacklist management.',
      },
      {
        question: 'Which API version should I use?',
        answer: 'Use public API v2 for new integrations. The canonical documentation base URL is https://graph.whats91.com/api/v2.',
      },
      {
        question: 'What is the base URL?',
        answer: 'The canonical base URL for public documentation examples is https://graph.whats91.com/api/v2.',
      },
    ],
  },
  'quick-start': {
    summary: 'Follow this page to generate a public API token, choose a WhatsApp sender, and send the first Whats91 v2 chat message.',
    prerequisites: ['A Whats91 customer login', 'A connected WhatsApp sender', 'A generated public API token'],
    seoTitle: 'Quick Start | Whats91 Developer Documentation',
    seoDescription: 'Send your first WhatsApp message with Whats91 API v2 using a public API token, sender ID, and the canonical chat endpoint.',
    relatedSectionIds: ['authentication', 'api-keys', 'messaging-chat-text', 'webhook-create'],
    faqs: [
      {
        question: 'How do I start a Whats91 API integration?',
        answer: 'Sign in to the customer dashboard, connect a WhatsApp sender, generate a public API token, and call POST /api/v2/chat with a bearer token.',
      },
      {
        question: 'Do I need a template for the first request?',
        answer: 'A text chat example can be used when the conversation rules allow it. For business-initiated messages outside the service window, use an approved template.',
      },
      {
        question: 'Where do I find the sender ID?',
        answer: 'Use the sender number or sender identifier shown in the Whats91 dashboard for the connected WhatsApp account.',
      },
    ],
  },
  'authentication': {
    summary: 'Learn how Whats91 authenticates public API v2 requests with bearer tokens and how sender selection works across request bodies and URL parameters.',
    prerequisites: ['A generated Whats91 public API token', 'Content-Type: application/json for JSON requests'],
    seoTitle: 'Authentication Guide | Whats91 Developer Documentation',
    seoDescription: 'Authenticate Whats91 API v2 requests with bearer tokens and understand sender resolution for WhatsApp Business API integrations.',
    relatedSectionIds: ['api-keys', 'quick-start', 'messaging-overview'],
    faqs: [
      {
        question: 'How do I authenticate requests?',
        answer: 'Send Authorization: Bearer <token> with every public API v2 request. The token is generated from the Whats91 customer dashboard.',
      },
      {
        question: 'Can I use dashboard session cookies for API calls?',
        answer: 'No. Public integrations should use bearer tokens, not dashboard session cookies.',
      },
      {
        question: 'How does Whats91 select the sender?',
        answer: 'Whats91 resolves the sender from the token, senderId, phoneNumberId, or route-specific sender value depending on the endpoint.',
      },
    ],
  },
  'api-keys': {
    summary: 'Use this page to understand where public API keys are generated, how they should be stored, and how they are used with v2 endpoints.',
    prerequisites: ['Customer dashboard access', 'Developer API token permission'],
    seoTitle: 'API Keys | Whats91 Developer Documentation',
    seoDescription: 'Generate, store, and use Whats91 public API keys for secure WhatsApp API v2 integrations.',
    relatedSectionIds: ['authentication', 'quick-start', 'rate-limits'],
    faqs: [
      {
        question: 'How do I generate API keys?',
        answer: 'Open the Whats91 customer dashboard, go to Developer API Tokens, and create or copy a public API token for server-side use.',
      },
      {
        question: 'Should API keys be used in frontend code?',
        answer: 'No. Keep public API tokens on trusted servers and never expose them in browser-side JavaScript or mobile app bundles.',
      },
      {
        question: 'Can I rotate API keys?',
        answer: 'Yes. Create a new token, update your server configuration, verify requests, and then disable the old token from the dashboard.',
      },
    ],
  },
  'rate-limits': {
    summary: 'Review Whats91 and Meta throughput constraints, safe sending patterns, and the operational guardrails that protect WhatsApp send quality.',
    prerequisites: ['An active sender', 'A send workflow that can retry or queue messages safely'],
    seoTitle: 'Rate Limits | Whats91 Developer Documentation',
    seoDescription: 'Understand Whats91 API rate limits, Meta messaging throughput, safe retry behavior, and WhatsApp sender quality guardrails.',
    relatedSectionIds: ['quick-start', 'messaging-overview', 'reports-delivery-analytics'],
    faqs: [
      {
        question: 'What rate limits apply to Whats91 APIs?',
        answer: 'Whats91 applies account and sender guardrails while Meta enforces WhatsApp throughput and quality limits for each sender.',
      },
      {
        question: 'What should I do when sends are throttled?',
        answer: 'Queue requests, retry with backoff, and monitor delivery reports instead of sending repeated immediate retries.',
      },
      {
        question: 'Do rate limits vary by sender?',
        answer: 'Yes. WhatsApp sender quality, account status, and Meta throughput tiers can affect how quickly messages are accepted and delivered.',
      },
    ],
  },
  'messaging-overview': {
    summary: 'Use Messaging APIs for Whats91-specific send and chat endpoints, including templates, text messages, media messages, and interactive WhatsApp messages.',
    prerequisites: ['Bearer token authentication', 'A connected sender', 'Approved templates for business-initiated template sends'],
    seoTitle: 'Messaging API | Whats91 Developer Documentation',
    seoDescription: 'Send WhatsApp template, text, media, and interactive messages with Whats91 Messaging API v2.',
    relatedSectionIds: ['template-marketing', 'webhook-create', 'reports-all'],
    faqs: [
      {
        question: 'How do I send a WhatsApp message?',
        answer: 'Use POST /api/v2/chat for text, media, and interactive chat messages, or POST /api/v2/send for approved template sends.',
      },
      {
        question: 'What message types are supported?',
        answer: 'Whats91 supports template sends, text chat, media chat, and interactive messages such as buttons, CTA, and list responses.',
      },
      {
        question: 'How do I track delivery?',
        answer: 'Use Webhooks and Reports to track accepted, sent, delivered, read, failed, and queued message states.',
      },
    ],
  },
  'messaging-meta-overview': {
    summary: 'Use Meta-compatible messaging endpoints when your integration already produces WhatsApp Cloud API style payloads and needs Whats91 handling.',
    prerequisites: ['Bearer token authentication', 'A Meta-compatible WhatsApp message body'],
    seoTitle: 'Messaging Meta-Compatibility API | Whats91 Developer Documentation',
    seoDescription: 'Send Meta-compatible WhatsApp Cloud API message payloads through Whats91 API v2 with Whats91 sender, billing, and reporting support.',
    relatedSectionIds: ['messaging-overview', 'messaging-meta-template', 'webhook-examples'],
    faqs: [
      {
        question: 'When should I use Meta-compatible messaging?',
        answer: 'Use it when your application already builds Meta WhatsApp Cloud API payloads and you want Whats91 to handle authentication, routing, billing, and reporting.',
      },
      {
        question: 'Does Whats91 change the Meta payload shape?',
        answer: 'The endpoint keeps the Meta-compatible request style while adding Whats91 processing and response metadata where needed.',
      },
      {
        question: 'Can I use phoneNumberId in the URL?',
        answer: 'Yes. Meta-compatible routes include variants that select the sender by phoneNumberId.',
      },
    ],
  },
  'template-marketing': {
    summary: 'Create MARKETING templates for promotions, offers, announcements, and campaign messages that require Meta review.',
    prerequisites: ['Bearer token authentication', 'Template name, language, category, and body text', 'Meta-compliant marketing content'],
    seoTitle: 'WhatsApp Template API | Whats91 Developer Documentation',
    seoDescription: 'Create WhatsApp marketing templates with Whats91 Template API v2, including request fields, examples, and Meta submission guidance.',
    relatedSectionIds: ['messaging-template-send', 'template-utility', 'template-authentication', 'webhook-create'],
    faqs: [
      {
        question: 'How do I create a template?',
        answer: 'Call POST /api/v2/templates with the template category, language, body text, and any supported buttons or examples.',
      },
      {
        question: 'How long does Meta approval take?',
        answer: 'Meta review time varies. Many templates are reviewed quickly, but approval timing depends on Meta systems and policy checks.',
      },
      {
        question: 'Can templates include variables?',
        answer: 'Yes. Include variables in the body and provide matching example values for Meta review.',
      },
    ],
  },
  'webhook-create': {
    summary: 'Create webhook destinations so Whats91 can deliver real-time message and account events to your HTTPS receiver.',
    prerequisites: ['Bearer token authentication', 'A public HTTPS receiver URL', 'Selected Whats91 event keys'],
    seoTitle: 'Webhook Documentation | Whats91 Developer Documentation',
    seoDescription: 'Create and manage Whats91 Webhooks v2 destinations for message delivery events, samples, and integration examples.',
    relatedSectionIds: ['webhook-samples', 'webhook-examples', 'reports-message-status', 'messaging-chat-text'],
    faqs: [
      {
        question: 'How do I create a webhook?',
        answer: 'Call POST /api/v2/webhooks with a destination name, HTTPS endpoint URL, event keys, and active status.',
      },
      {
        question: 'What events can webhooks send?',
        answer: 'Webhook event keys cover message lifecycle updates and related Whats91 delivery events documented in the samples page.',
      },
      {
        question: 'Should webhook receivers verify requests?',
        answer: 'Yes. Receivers should validate origin, use HTTPS, log payloads, and respond quickly with a successful status.',
      },
    ],
  },
  'reports-all': {
    summary: 'Use Reports APIs to fetch message reports, statuses, mobile-number history, campaign reporting, and delivery analytics.',
    prerequisites: ['Bearer token authentication', 'Date filters or identifiers for scoped report lookups'],
    seoTitle: 'Reports API | Whats91 Developer Documentation',
    seoDescription: 'Fetch Whats91 message reports, delivery analytics, campaign reports, and message history with public API v2.',
    relatedSectionIds: ['reports-message-status', 'reports-mobile-history', 'webhook-samples', 'billing-user-history'],
    faqs: [
      {
        question: 'How do I fetch message reports?',
        answer: 'Use GET /api/v2/reports with pagination and filters such as sender, status, date range, and mobile number.',
      },
      {
        question: 'Can I look up one message status?',
        answer: 'Yes. Use the message status endpoint with the required message identifier to retrieve the current report status.',
      },
      {
        question: 'Are reports real-time?',
        answer: 'Reports reflect Whats91 processing and webhook updates. Use Webhooks for real-time event delivery and Reports for querying stored state.',
      },
    ],
  },
  'billing-user-history': {
    summary: 'Use Message Billing APIs to inspect user-level billing history, sender-specific billing, template-type costs, and delivered/payable/free classifications.',
    prerequisites: ['Bearer token authentication', 'Billing permissions on the Whats91 account'],
    seoTitle: 'Message Billing API | Whats91 Developer Documentation',
    seoDescription: 'Review Whats91 message billing history, wallet usage, delivered messages, payable messages, and free classifications through API v2.',
    relatedSectionIds: ['billing-number-history', 'billing-template-type', 'reports-all', 'reports-delivery-analytics'],
    faqs: [
      {
        question: 'How do I retrieve billing history?',
        answer: 'Use GET /api/v2/billing/history with account, sender, template, classification, and date filters where supported.',
      },
      {
        question: 'What is a payable message?',
        answer: 'A payable message is a delivered or accepted billing record that counts toward the customer billing model according to Whats91 and Meta rules.',
      },
      {
        question: 'Can I filter by sender number?',
        answer: 'Yes. Use the number-specific billing history endpoint to review billing records for one sender.',
      },
    ],
  },
  'chatbot-list': {
    summary: 'Use Chatbot APIs to list, retrieve, and create Whats91 chatbot configurations for automated WhatsApp responses.',
    prerequisites: ['Bearer token authentication', 'A connected WhatsApp sender for chatbot activation'],
    seoTitle: 'Whats91 Chatbot API Documentation',
    seoDescription: 'Create and manage WhatsApp chatbots using Whats91 API v2, including text, media, button, CTA, and list-response chatbots.',
    relatedSectionIds: ['chatbot-create', 'chatbot-interactive', 'messaging-chat-interactive', 'webhook-examples'],
    faqs: [
      {
        question: 'How do I create a chatbot?',
        answer: 'Use the chatbot creation endpoints with trigger rules, response type, sender scope, and response content.',
      },
      {
        question: 'What chatbot response types are supported?',
        answer: 'Whats91 supports text, public media URL, button, CTA, and list-response chatbot flows.',
      },
      {
        question: 'Can I retrieve existing chatbots?',
        answer: 'Yes. Use the list and get chatbot endpoints to inspect existing chatbot configurations.',
      },
    ],
  },
  'contact-book-list': {
    summary: 'Use Contact Book APIs to list books, inspect contacts, create or update books, and upload JSON contact batches.',
    prerequisites: ['Bearer token authentication', 'A global customer-level API token for contact book management'],
    seoTitle: 'Contact Book API | Whats91 Developer Documentation',
    seoDescription: 'Manage Whats91 contact books, contacts, and JSON bulk uploads through public API v2.',
    relatedSectionIds: ['contact-book-contacts', 'contact-book-upload', 'messaging-template-send', 'blacklist-list'],
    faqs: [
      {
        question: 'How do I list contact books?',
        answer: 'Use GET /api/v2/contact-books with pagination to retrieve the customer account contact books.',
      },
      {
        question: 'Can I upload contacts in bulk?',
        answer: 'Yes. Use the JSON bulk upload endpoint with an array of contact rows and supported custom fields.',
      },
      {
        question: 'Are contact books sender-specific?',
        answer: 'Contact books are customer-account-wide resources used by messaging and campaign workflows.',
      },
    ],
  },
  'blacklist-list': {
    summary: 'Use Blacklist APIs to list, retrieve, add, update, and soft-delete blocked WhatsApp recipients for sender-scoped protection.',
    prerequisites: ['Bearer token authentication', 'A sender scope for number-level blacklist management'],
    seoTitle: 'Blacklist API | Whats91 Developer Documentation',
    seoDescription: 'Manage Whats91 message blacklist entries with public API v2 list, add, update, and delete endpoints.',
    relatedSectionIds: ['blacklist-add', 'blacklist-update', 'messaging-chat-text', 'reports-message-status'],
    faqs: [
      {
        question: 'How do I add a number to the blacklist?',
        answer: 'Use the add blacklist endpoint with the mobile number and sender scope so future sends can be blocked.',
      },
      {
        question: 'Can blacklist entries be updated?',
        answer: 'Yes. Use the update endpoint to adjust blacklist metadata or active state where supported.',
      },
      {
        question: 'Does delete permanently remove a blacklist entry?',
        answer: 'The public API documents soft removal behavior so historical reporting context can remain available.',
      },
    ],
  },
  'conversations-list': {
    summary: 'Use Conversations APIs to fetch conversation reports, summaries, by-mobile threads, conversation details, and paginated messages.',
    prerequisites: ['Bearer token authentication', 'Conversation filters such as sender, mobile number, date range, status, or labels'],
    seoTitle: 'Conversations API | Whats91 Developer Documentation',
    seoDescription: 'Fetch Whats91 conversation reports, summaries, threads, details, and messages with public API v2 GET endpoints.',
    relatedSectionIds: ['conversations-summary', 'conversations-by-mobile', 'reports-all', 'webhook-samples'],
    faqs: [
      {
        question: 'How do I list conversations?',
        answer: 'Use GET /api/v2/reports/conversations with filters such as senderId, date range, status, labels, and pagination.',
      },
      {
        question: 'Can I fetch messages for one conversation?',
        answer: 'Yes. Use the conversation messages endpoint with the conversation identifier and pagination parameters.',
      },
      {
        question: 'Can I search by mobile number?',
        answer: 'Yes. Use the by-mobile endpoint to fetch conversation threads for a specific recipient number.',
      },
    ],
  },
}

// ---------------------------------------------------------------------------
// Documentation sections — full content
// ---------------------------------------------------------------------------

export const docSections: DocSectionData[] = [
  // =========================================================================
  // GETTING STARTED
  // =========================================================================
  {
    id: 'overview',
    title: 'Overview',
    slug: 'overview',
    description: 'Introduction to Whats91 public API v2 and its canonical endpoint surface.',
    category: 'getting-started',
    icon: 'Rocket',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Whats91 API Overview',
      },
      {
        type: 'paragraph',
        text: 'Whats91 is a developer layer over Meta WhatsApp Cloud API. Customers generate a Whats91 public API token, call Whats91 v2 endpoints, and Whats91 handles sender resolution, billing and blacklist guards, media handling, report logging, reconnect queues, and Meta API submission.',
      },
      {
        type: 'callout',
        variant: 'tip',
        text: 'This developer portal documents public API version 2 only. Legacy v1 routes and old token examples should not be used for new integrations.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Base URL',
      },
      {
        type: 'code',
        language: 'text',
        code: 'https://graph.whats91.com/api/v2',
        label: 'Canonical Base URL',
      },
      {
        type: 'paragraph',
        text: 'Build public integrations around the canonical base path above. The backend also mounts a smaller /v2 surface for send/chat/messages compatibility, but /api/v2 is the documented path for this portal because it includes message and template management routes.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Public v2 APIs',
      },
      {
        type: 'table',
        headers: ['API', 'Method', 'Path', 'Purpose'],
        rows: [
          ['Send template', 'POST', '/api/v2/send', 'Send an approved WhatsApp template through the Whats91 template sender.'],
          ['Send chat/free-form message', 'POST', '/api/v2/chat', 'Send text, media, reply-button, or list messages.'],
          ['Meta-compatible messages', 'POST', '/api/v2/messages', 'Send a raw Meta-compatible WhatsApp Cloud API message payload through Whats91 handling.'],
          ['Meta-compatible messages for a phone number', 'POST', '/api/v2/{phoneNumberId}/messages', 'Send a Meta-compatible payload while selecting the sender by URL phoneNumberId.'],
          ['List templates', 'GET', '/api/v2/templates', 'List standard, non-carousel templates for the authenticated sender.'],
          ['Get template', 'GET', '/api/v2/templates/{identifier}', 'Read one standard template by public identifier.'],
          ['Create template', 'POST', '/api/v2/templates', 'Create a standard template locally and submit it to Meta for review.'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'What Whats91 Handles',
      },
      {
        type: 'list',
        items: [
          'Resolves the customer\'s connected WhatsApp sender from the token, senderId, or phoneNumberId route.',
          'Applies billing, account-state, blacklist, and sender reconnect guards before submitting to Meta.',
          'Accepts JSON and multipart requests for send/chat/template APIs where supported.',
          'Stores send attempts and webhook updates so dashboard reports can show accepted, sent, delivered, read, failed, and queued states.',
          'Uses Meta Graph API behind the scenes for message sends, template create/list/status, media handling, and webhook subscriptions.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Quick Example',
      },
      {
        type: 'code',
        language: 'curl',
        code: `curl -X POST "https://graph.whats91.com/api/v2/chat" \\
  -H "Authorization: Bearer w91_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "senderId": "919999999999",
    "to": "918888888888",
    "type": "text",
    "text": "Hello from Whats91"
  }'`,
        label: 'curl',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Dashboard Context',
      },
      {
        type: 'paragraph',
        text: 'Internal dashboard APIs such as API token management, templates, webhooks, reports, and live logger routes are session-authenticated workflow surfaces. Public integrations should call the bearer-token v2 APIs documented here, not dashboard session APIs.',
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Send responses are acceptance receipts from Whats91 or Meta, not final delivery receipts. Use Webhooks v2 and dashboard reports for delivery, read, and failure tracking.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'quick-start',
    title: 'Quick Start',
    slug: 'quick-start',
    description: 'Generate a v2 token and send your first WhatsApp text message through Whats91.',
    category: 'getting-started',
    icon: 'Rocket',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Quick Start',
      },
      {
        type: 'paragraph',
        text: 'Follow this flow when setting up a new integration. It starts in the customer dashboard, then moves to a public v2 request using POST /api/v2/chat.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Before You Call the API',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Sign in to the Whats91 customer dashboard.',
          'Complete WhatsApp Cloud API setup for at least one sender number under WhatsApp -> WhatsApp Setup or the current onboarding flow.',
          'Confirm the active sender in the dashboard number selector.',
          'Generate a public API token from Developer -> API Tokens.',
          'Use Authorization: Bearer <token> on all public v2 requests.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Send a Text Message',
      },
      {
        type: 'paragraph',
        text: 'Start with a free-form text message through POST /api/v2/chat. Include senderId when your token can access more than one connected WhatsApp sender.',
      },
      {
        type: 'code',
        language: 'curl',
        code: `curl -X POST "https://graph.whats91.com/api/v2/chat" \\
  -H "Authorization: Bearer w91_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "senderId": "919999999999",
    "to": "918888888888",
    "type": "text",
    "text": "Hello from Whats91"
  }'`,
        label: 'curl',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Expected Response',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "success": true,
  "message": "Message accepted by Meta",
  "data": {
    "messageId": "wamid.xxxxx",
    "message_id": "wamid.xxxxx",
    "queued": false,
    "status": "accepted",
    "senderId": "919999999999",
    "phoneNumberId": "1234567890",
    "receiverId": "918888888888",
    "messageType": "text",
    "templateName": null,
    "apiResponse": {}
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid",
    "processingTimeMs": 120
  }
}`,
        label: 'Success Response',
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'If the WhatsApp setup is reconnecting, Whats91 can return queued: true with queueUid, reportUid, and status waiting_reconnect. Treat that as accepted for retry processing and monitor delivery through reports or webhooks.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Next Steps',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Create or sync templates under WhatsApp -> Templates.',
          'After Meta approval, send templates through POST /api/v2/send.',
          'Configure status webhooks under Settings -> Webhooks.',
          'Monitor delivery and failures under Reports -> All Messages, Reports -> All Events, and Developer -> Logger.',
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'authentication',
    title: 'Authentication',
    slug: 'authentication',
    description: 'Authenticate public v2 requests with managed Whats91 bearer tokens.',
    category: 'getting-started',
    icon: 'Lock',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Authentication',
      },
      {
        type: 'paragraph',
        text: 'Public v2 APIs use managed Whats91 bearer tokens. Generate tokens in the customer dashboard, store them server-side, and send them in the Authorization header on every request.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Bearer Token Authentication',
      },
      {
        type: 'code',
        language: 'http',
        code: `Authorization: Bearer w91_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`,
        label: 'HTTP Header',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Where Tokens Are Accepted',
      },
      {
        type: 'table',
        headers: ['Endpoint', 'Preferred location', 'Compatibility fallback'],
        rows: [
          ['POST /api/v2/send', 'Authorization header', 'JSON or multipart field authToken, auth_token, or token'],
          ['POST /api/v2/chat', 'Authorization header', 'JSON or multipart field authToken, auth_token, or token'],
          ['GET /api/v2/templates', 'Authorization header', 'Query authToken, auth_token, or token'],
          ['GET /api/v2/templates/{identifier}', 'Authorization header', 'Query authToken, auth_token, or token'],
          ['POST /api/v2/templates', 'Authorization header', 'JSON or multipart field authToken, auth_token, or token'],
          ['POST /api/v2/messages', 'Authorization header', 'JSON body authToken, auth_token, or token'],
          ['POST /api/v2/{phoneNumberId}/messages', 'Authorization header', 'JSON body authToken, auth_token, or token'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Sender Selection',
      },
      {
        type: 'paragraph',
        text: 'senderId is the WhatsApp sender phone number. It is optional when the token scope or selected/default sender can resolve the sender. Use senderId when a global token can access multiple numbers. Number-scoped tokens can only use their assigned WhatsApp number. For Meta-compatible sends, POST /api/v2/{phoneNumberId}/messages is the most explicit sender selection.',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "senderId": "919999999999",
  "to": "918888888888",
  "type": "text",
  "text": "Hello from Whats91"
}`,
        label: 'Sender selection example',
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'Do not expose bearer tokens in browser code, mobile apps, public repositories, or support tickets. Treat every token as a server-side secret.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'api-keys',
    title: 'API Keys',
    slug: 'api-keys',
    description: 'Generate and manage managed w91_live_ API tokens from the Whats91 dashboard.',
    category: 'getting-started',
    icon: 'KeyRound',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'API Keys',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Generate an API Token',
      },
      {
        type: 'paragraph',
        text: 'Create managed tokens from Developer -> API Tokens in the Whats91 customer dashboard. New documentation should recommend managed w91_live_ tokens instead of legacy customer tokens.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Open Developer -> API Tokens.',
          'Choose the active WhatsApp sender if the token should be number-specific.',
          'Click create token and enter a token name.',
          'Select expiration: one week, one month, three months, six months, one year, custom date, or never.',
          'Select scope: global, selected_number, or specific_number.',
          'Copy the generated token immediately. The full token is shown once only.',
          'Store it server-side in the integrating system and revoke old tokens when no longer needed.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Token Scopes',
      },
      {
        type: 'table',
        headers: ['Scope', 'Behavior'],
        rows: [
          ['global', 'Token can resolve any allowed sender for the customer.'],
          ['selected_number', 'Token is bound to the currently selected sender.'],
          ['specific_number', 'Token is bound to a sender chosen from connected numbers.'],
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'Managed tokens start with w91_live_. Whats91 stores only a SHA-256 hash, token prefix, and last four characters, along with scope, sender binding, expiry, last used time, revoked time, and status.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Operational Guidance',
      },
      {
        type: 'list',
        items: [
          'Create separate tokens for production, staging, and each integration partner.',
          'Use number-scoped tokens when an integration should only send from one WhatsApp sender.',
          'Rotate tokens on a planned schedule and revoke unused tokens from Developer -> API Tokens.',
          'Keep legacy customer tokens out of new integrations; use managed w91_live_ tokens instead.',
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'rate-limits',
    title: 'Rate Limits',
    slug: 'rate-limits',
    description: 'Understand Meta-backed WhatsApp limits and Whats91 guardrails before sending at scale.',
    category: 'getting-started',
    icon: 'Gauge',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Rate Limits',
      },
      {
        type: 'paragraph',
        text: 'Whats91 public v2 currently does not document a separate public rate limit. Meta WhatsApp Business Platform limits apply, and Whats91 may also fail requests because of account state, billing, blacklist, or sender reconnect state.',
      },
      {
        type: 'cards',
        cards: [
          {
            title: 'Cloud API Throughput',
            value: '80 mps',
            description: '80 messages per second per registered business phone number by default. Eligible numbers can be automatically upgraded to 1,000 mps. Throughput includes inbound and outbound messages and all message types.',
            tone: 'green',
          },
          {
            title: 'Coexistence Numbers',
            value: '20 mps',
            description: 'Numbers used with both WhatsApp Business app and Cloud API have fixed throughput of 20 mps.',
            tone: 'blue',
          },
          {
            title: 'Throughput Errors',
            value: '130429 / 131057',
            description: 'Meta can return error code 130429 when current throughput is exceeded. During a throughput upgrade, Meta can return 131057.',
            tone: 'amber',
          },
          {
            title: 'Pair Rate Limit',
            value: '1 per 6 sec',
            description: 'A business phone number is limited to roughly one message every six seconds to the same WhatsApp user, equivalent to about 10/minute or 600/hour. Meta can return 131056.',
            tone: 'red',
          },
          {
            title: 'Pair Burst',
            value: '45 in 6 sec',
            description: 'Meta allows bursts up to 45 messages in six seconds, then blocks follow-up sends to that same user until the borrowed time passes.',
            tone: 'slate',
          },
          {
            title: 'Messaging Limit Tiers',
            value: '250 -> unlimited',
            description: 'New business portfolios start at 250 unique users and can scale to 2,000, 10,000, 100,000, and unlimited. After reaching 2,000, Meta can scale the portfolio one level within six hours when quality and usage criteria are met.',
            tone: 'green',
          },
          {
            title: 'Webhook Capacity',
            value: '3x + 1x',
            description: 'Meta recommends webhook servers handle 3x outgoing message traffic as status webhooks plus 1x expected inbound traffic. Meta retries failed webhooks for up to seven days with exponential backoff.',
            tone: 'blue',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Handling Limit Errors',
      },
      {
        type: 'list',
        items: [
          'Queue and retry sends with backoff when Meta returns throughput or pair-rate errors.',
          'Spread high-volume sends across approved templates, healthy sender numbers, and time windows.',
          'Watch message quality and messaging limits in Meta/Whats91 dashboards before scheduling campaigns.',
          'Size webhook infrastructure before high-volume sends because status callbacks can outnumber outgoing requests.',
        ],
      },
    ],
  },

  // =========================================================================
  // MESSAGING
  // =========================================================================
  {
    id: 'messaging-overview',
    title: 'Overview',
    slug: 'overview',
    description: 'Understand the Whats91-specific message sending endpoints for templates, chat messages, media, buttons, and lists.',
    category: 'messaging',
    icon: 'MessageSquare',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Messaging Overview',
      },
      {
        type: 'paragraph',
        text: 'The Messaging section documents the Whats91 project-specific public API shape. Use POST /api/v2/send for approved template sends, and POST /api/v2/chat for session/chat messages such as text, media, quick reply buttons, and list messages.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Endpoints',
      },
      {
        type: 'table',
        headers: ['Method and path', 'Use for', 'Content types'],
        rows: [
          ['POST /api/v2/send', 'Approved WhatsApp template sends using Whats91 field names and aliases.', 'application/json, multipart/form-data'],
          ['POST /api/v2/chat', 'Free-form customer service window chat messages: text, media, buttons, and lists.', 'application/json, multipart/form-data'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Authentication and Sender Selection',
      },
      {
        type: 'paragraph',
        text: 'Send Authorization: Bearer w91_live_xxxxxxxxxxxxxxxxx in the request headers. JSON and multipart requests can also include authToken, auth_token, or token when a client cannot send headers.',
      },
      {
        type: 'paragraph',
        text: 'senderId is the WhatsApp registered sender phone number. It is optional when the public token resolves a default sender, and number-scoped tokens can only send from their assigned sender.',
      },
      {
        type: 'paragraph',
        text: 'Multipart media uploads on these Whats91-specific endpoints have a 16 MB upload limit. Use the Chat Media page for supported upload extensions and media field aliases.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Common Response',
      },
      {
        type: 'paragraph',
        text: 'Successful sends return data.messageId, data.status, data.senderId, data.phoneNumberId, data.receiverId, and metadata.requestId.',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "success": true,
  "data": {
    "messageId": "wamid.HBgMOTE4ODg4ODg4ODg4FQIAERgSMzA2N0Q3...",
    "status": "sent",
    "senderId": "919999999999",
    "phoneNumberId": "1234567890",
    "receiverId": "918888888888"
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
        label: 'Success response',
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'When a sender is temporarily reconnecting, Whats91 can accept the request and return queued: true with queueUid and reportUid so delivery can continue after the sender reconnects.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'messaging-template-send',
    title: 'Template Send',
    slug: 'template-send',
    description: 'Send approved WhatsApp templates with Whats91-specific fields, aliases, media headers, and button parameters.',
    category: 'messaging',
    icon: 'Send',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Template Send',
      },
      {
        type: 'paragraph',
        text: 'Use POST /api/v2/send to send an approved WhatsApp template by name. Whats91 resolves the sender, applies billing and blacklist checks, logs reports, and forwards the request to Meta.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Required and Optional Fields',
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/send',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'Registered WhatsApp sender number. Required when the token cannot resolve a default sender.' },
          { name: 'to', type: 'string', required: true, description: 'Recipient phone number. Aliases: receiverId, receiver_id, receiver.' },
          { name: 'templateName', type: 'string', required: true, description: 'Approved template name. Alias: template_name.' },
          { name: 'parameters', type: 'array', required: false, description: 'Template body variable values in order.' },
          { name: 'buttonParameters', type: 'array', required: false, description: 'Button variable values. Alias: button_parameters.' },
          { name: 'mediaUrl', type: 'string', required: false, description: 'Public media URL for templates with media headers. Aliases: media_url, mediaurl.' },
          { name: 'mediaFile', type: 'file', required: false, description: 'Multipart media upload for template headers. Aliases: media_file, uploadFile, upload_file.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/send" \\
  -H "Authorization: Bearer w91_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "senderId": "919999999999",
    "to": "918888888888",
    "templateName": "payment_reminder",
    "parameters": ["Devendar", "INV-1001"],
    "buttonParameters": ["pay_INV-1001"],
    "mediaUrl": "https://example.com/invoice.pdf"
  }'`,
            label: 'curl',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
}`,
            label: '200 OK',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Multipart Media Header',
      },
      {
        type: 'code',
        language: 'curl',
        code: `curl -X POST "https://graph.whats91.com/api/v2/send" \\
  -H "Authorization: Bearer w91_live_xxx" \\
  -F "senderId=919999999999" \\
  -F "to=918888888888" \\
  -F "templateName=delivery_receipt" \\
  -F "parameters[]=Devendar" \\
  -F "parameters[]=ORD-4431" \\
  -F "mediaFile=@receipt.pdf"`,
        label: 'curl - multipart/form-data',
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'Carousel templates are not supported on POST /api/v2/send. A carousel template returns CAROUSEL_TEMPLATE_NOT_SUPPORTED_IN_V2_SEND.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'messaging-chat-text',
    title: 'Chat Text',
    slug: 'chat-text',
    description: 'Send Whats91-specific free-form chat text messages inside the customer service window.',
    category: 'messaging',
    icon: 'MessageSquare',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Chat Text',
      },
      {
        type: 'paragraph',
        text: 'Use POST /api/v2/chat for free-form text replies. If type is omitted and no media, buttons, or list payload is present, Whats91 treats the request as a text message.',
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/chat',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'Registered WhatsApp sender number.' },
          { name: 'to', type: 'string', required: true, description: 'Recipient phone number. Aliases: receiverId, receiver_id, receiver.' },
          { name: 'text', type: 'string', required: true, description: 'Message body text. Aliases: messageText, message_text, body, message.' },
          { name: 'type', type: 'string', required: false, description: 'Optional. Defaults to text when omitted.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/chat" \\
  -H "Authorization: Bearer w91_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "senderId": "919999999999",
    "to": "918888888888",
    "messageText": "Your support ticket has been updated."
  }'`,
            label: 'curl',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "data": {
    "messageId": "wamid.xxxxx",
    "status": "sent",
    "receiverId": "918888888888"
  },
  "metadata": {
    "requestId": "request-uuid"
  }
}`,
            label: '200 OK',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'danger',
        text: 'If no text alias is supplied for a text request, Whats91 returns MISSING_TEXT.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'messaging-chat-media',
    title: 'Chat Media',
    slug: 'chat-media',
    description: 'Send image, video, audio, and document chat messages through Whats91-specific media fields.',
    category: 'messaging',
    icon: 'Image',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Chat Media',
      },
      {
        type: 'paragraph',
        text: 'POST /api/v2/chat supports image, video, audio, and document messages by mediaUrl, mediaId, or mediaFile. JSON requests can reference hosted media or an existing media id; multipart/form-data can upload a file directly.',
      },
      {
        type: 'table',
        headers: ['Field', 'Required', 'Description'],
        rows: [
          ['to', 'Yes', 'Recipient phone number. Aliases: receiverId, receiver_id, receiver.'],
          ['type', 'Yes', 'image, video, audio, or document.'],
          ['mediaUrl', 'Conditional', 'Public media URL. Alias: media_url.'],
          ['mediaId', 'Conditional', 'Previously uploaded media id. Alias: media_id.'],
          ['mediaFile', 'Conditional', 'Multipart file upload. Aliases: media_file, uploadFile, upload_file.'],
          ['caption', 'No', 'Optional caption for image, video, and document messages.'],
          ['filename', 'No', 'Optional document filename.'],
        ],
      },
      {
        type: 'paragraph',
        text: 'The direct upload limit is 16 MB. Supported upload extensions are pdf, txt, doc, docx, xls, xlsx, csv, jpg, jpeg, png, gif, mp3, mp4, 3gp, 3gpp.',
      },
      {
        type: 'code',
        language: 'curl',
        code: `curl -X POST "https://graph.whats91.com/api/v2/chat" \\
  -H "Authorization: Bearer w91_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "senderId": "919999999999",
    "to": "918888888888",
    "type": "document",
    "mediaUrl": "https://example.com/invoice.pdf",
    "caption": "Invoice INV-1001",
    "filename": "invoice.pdf"
  }'`,
        label: 'curl - mediaUrl',
      },
      {
        type: 'code',
        language: 'curl',
        code: `curl -X POST "https://graph.whats91.com/api/v2/chat" \\
  -H "Authorization: Bearer w91_live_xxx" \\
  -F "senderId=919999999999" \\
  -F "to=918888888888" \\
  -F "type=image" \\
  -F "caption=Product photo" \\
  -F "mediaFile=@product.jpg"`,
        label: 'curl - multipart/form-data',
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'A media message without mediaUrl, mediaId, or mediaFile returns MISSING_MEDIA. Non-JSON and non-multipart requests return UNSUPPORTED_CONTENT_TYPE.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'messaging-chat-interactive',
    title: 'Chat Interactive',
    slug: 'chat-interactive',
    description: 'Send Whats91-specific quick reply button and list messages through the chat endpoint.',
    category: 'messaging',
    icon: 'MousePointerClick',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Chat Interactive',
      },
      {
        type: 'paragraph',
        text: 'POST /api/v2/chat supports two Whats91-specific interactive structures: quick reply buttons and list messages. Use these inside the customer service window when the user can respond directly in WhatsApp.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Quick Reply Buttons',
      },
      {
        type: 'paragraph',
        text: 'Use type interactive, button, or buttons with a buttons array. You can send max 3 buttons; each title is limited to 20 characters and each id is limited to 256 characters.',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "senderId": "919999999999",
  "to": "918888888888",
  "type": "buttons",
  "text": "Choose an option",
  "buttons": [
    { "id": "pay_now", "title": "Pay now" },
    { "id": "talk_agent", "title": "Talk to agent" }
  ]
}`,
        label: 'Button body',
      },
      {
        type: 'heading',
        level: 2,
        text: 'List Messages',
      },
      {
        type: 'paragraph',
        text: 'Use type list or interactive_list with headerText, text, footerText, buttonText, and sections.rows. A list can include max 10 rows across all sections.',
      },
      {
        type: 'code',
        language: 'curl',
        code: `curl -X POST "https://graph.whats91.com/api/v2/chat" \\
  -H "Authorization: Bearer w91_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "senderId": "919999999999",
    "to": "918888888888",
    "type": "list",
    "headerText": "Support menu",
    "text": "Select the topic you need help with.",
    "footerText": "Whats91 Support",
    "buttonText": "View options",
    "sections": [
      {
        "title": "Requests",
        "rows": [
          { "id": "billing", "title": "Billing" },
          { "id": "technical", "title": "Technical" }
        ]
      }
    ]
  }'`,
        label: 'curl - list',
      },
      {
        type: 'callout',
        variant: 'danger',
        text: 'Unsupported chat types return UNSUPPORTED_CHAT_MESSAGE_TYPE.',
      },
    ],
  },

  // =========================================================================
  // MESSAGING META-COMPATIBILITY
  // =========================================================================
  {
    id: 'messaging-meta-overview',
    title: 'Overview',
    slug: 'overview',
    description: 'Understand the Meta-compatible JSON message sending endpoints exposed through Whats91.',
    category: 'messaging-meta',
    icon: 'Code2',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Messaging Meta-Compatibility Overview',
      },
      {
        type: 'paragraph',
        text: 'The Messaging Meta-Compatibility section documents Meta WhatsApp Cloud API-style JSON payloads accepted by Whats91. Use these endpoints when your integration already builds Meta-style message bodies and needs Whats91 authentication, sender resolution, billing guard, blacklist guard, report logging, reconnect queue, and conversation logging.',
      },
      {
        type: 'table',
        headers: ['Method and path', 'Purpose'],
        rows: [
          ['POST /api/v2/messages', 'Send a Meta-compatible payload. Sender resolves from token/default or senderId.'],
          ['POST /api/v2/{phoneNumberId}/messages', 'Send through the sender phoneNumberId selected by the URL path.'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Content type is application/json only. Supported Meta payload types are text, image, video, audio, document, sticker, location, contacts, template, interactive, and reaction.',
      },
      {
        type: 'paragraph',
        text: 'Every Meta-compatible body should include messaging_product: whatsapp, the recipient to, and either an explicit type with its matching object or an omitted type that defaults to text.',
      },
      {
        type: 'list',
        items: [
          'Authorization: Bearer w91_live_xxx is required unless auth is supplied in the JSON token fields.',
          'to is required for every send request.',
          'type defaults to text when omitted.',
          'If type is supplied, the matching object is required; for example text for type text or template for type template.',
          'senderId can be sent in the body for POST /api/v2/messages.',
          'senderId is ignored when POST /api/v2/{phoneNumberId}/messages selects the sender by path.',
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'messaging-meta-text',
    title: 'Text',
    slug: 'text',
    description: 'Send Meta-compatible text messages through the Whats91 public API.',
    category: 'messaging-meta',
    icon: 'MessageSquare',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Meta-Compatible Text',
      },
      {
        type: 'paragraph',
        text: 'Send a text message with a Meta-style text object. The request body uses messaging_product, to, type, and text.body.',
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/messages',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'Sender phone number for body-selected sends.' },
          { name: 'messaging_product', type: 'string', required: true, description: 'Must be whatsapp.' },
          { name: 'to', type: 'string', required: true, description: 'Recipient WhatsApp phone number.' },
          { name: 'type', type: 'string', required: false, description: 'Set to text. Defaults to text when omitted.' },
          { name: 'text.body', type: 'string', required: true, description: 'Message body text.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/messages" \\
  -H "Authorization: Bearer w91_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "senderId": "919999999999",
    "messaging_product": "whatsapp",
    "to": "918888888888",
    "type": "text",
    "text": {
      "body": "Hello from a Meta-compatible payload"
    }
  }'`,
            label: 'curl - body sender',
          },
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/1234567890/messages" \\
  -H "Authorization: Bearer w91_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messaging_product": "whatsapp",
    "to": "918888888888",
    "type": "text",
    "text": {
      "body": "Hello from a path-selected sender"
    }
  }'`,
            label: 'curl - path phoneNumberId',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'messaging-meta-template',
    title: 'Template',
    slug: 'template',
    description: 'Send Meta-compatible template messages with language and components objects.',
    category: 'messaging-meta',
    icon: 'FileText',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Meta-Compatible Template',
      },
      {
        type: 'paragraph',
        text: 'Use a Meta-style template object with name, language, and components. Body, header, and button parameters should follow the Meta Cloud API component structure.',
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/messages',
        parameters: [
          { name: 'messaging_product', type: 'string', required: true, description: 'Must be whatsapp.' },
          { name: 'to', type: 'string', required: true, description: 'Recipient WhatsApp phone number.' },
          { name: 'type', type: 'string', required: true, description: 'Set to template.' },
          { name: 'template.name', type: 'string', required: true, description: 'Approved template name.' },
          { name: 'template.language.code', type: 'string', required: true, description: 'Template language code, such as en or en_US.' },
          { name: 'template.components', type: 'array', required: false, description: 'Meta-style component array containing header, body, or button parameters.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/messages" \\
  -H "Authorization: Bearer w91_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "senderId": "919999999999",
    "messaging_product": "whatsapp",
    "to": "918888888888",
    "type": "template",
    "template": {
      "name": "payment_reminder",
      "language": { "code": "en" },
      "components": [
        {
          "type": "body",
          "parameters": [
            { "type": "text", "text": "Devendar" },
            { "type": "text", "text": "INV-1001" }
          ]
        }
      ]
    }
  }'`,
            label: 'curl',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'messaging-meta-media',
    title: 'Media',
    slug: 'media',
    description: 'Send Meta-compatible image, video, audio, document, and sticker message payloads.',
    category: 'messaging-meta',
    icon: 'Image',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Meta-Compatible Media',
      },
      {
        type: 'paragraph',
        text: 'For Meta-compatible media sends, set type to image, video, audio, document, or sticker and include the matching object. Media objects use link or id. Documents can also include filename and caption.',
      },
      {
        type: 'table',
        headers: ['Message type', 'Required object', 'Common fields'],
        rows: [
          ['image', 'image', 'link or id, caption'],
          ['video', 'video', 'link or id, caption'],
          ['audio', 'audio', 'link or id'],
          ['document', 'document', 'link or id, filename, caption'],
          ['sticker', 'sticker', 'link or id'],
        ],
      },
      {
        type: 'code',
        language: 'curl',
        code: `curl -X POST "https://graph.whats91.com/api/v2/messages" \\
  -H "Authorization: Bearer w91_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "senderId": "919999999999",
    "messaging_product": "whatsapp",
    "to": "918888888888",
    "type": "document",
    "document": {
      "link": "https://example.com/invoice.pdf",
      "filename": "invoice.pdf",
      "caption": "Invoice INV-1001"
    }
  }'`,
        label: 'curl - document',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'messaging-meta-interactive',
    title: 'Interactive',
    slug: 'interactive',
    description: 'Send Meta-compatible interactive button and list payloads.',
    category: 'messaging-meta',
    icon: 'MousePointerClick',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Meta-Compatible Interactive',
      },
      {
        type: 'paragraph',
        text: 'Use type interactive with a Meta-style interactive object. Common interactive structures are button and list. Buttons use action.buttons with reply ids and titles; lists use action.sections with rows.',
      },
      {
        type: 'code',
        language: 'curl',
        code: `curl -X POST "https://graph.whats91.com/api/v2/messages" \\
  -H "Authorization: Bearer w91_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "senderId": "919999999999",
    "messaging_product": "whatsapp",
    "to": "918888888888",
    "type": "interactive",
    "interactive": {
      "type": "button",
      "body": { "text": "Choose an option" },
      "action": {
        "buttons": [
          {
            "type": "reply",
            "reply": { "id": "pay_now", "title": "Pay now" }
          }
        ]
      }
    }
  }'`,
        label: 'curl - button',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "messaging_product": "whatsapp",
  "to": "918888888888",
  "type": "interactive",
  "interactive": {
    "type": "list",
    "body": { "text": "Select a service" },
    "action": {
      "button": "View services",
      "sections": [
        {
          "title": "Support",
          "rows": [
            { "id": "billing", "title": "Billing" },
            { "id": "technical", "title": "Technical" }
          ]
        }
      ]
    }
  }
}`,
        label: 'List payload',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'messaging-meta-errors',
    title: 'Responses & Errors',
    slug: 'responses-errors',
    description: 'Review Meta-compatible response shapes, validation rules, and error codes.',
    category: 'messaging-meta',
    icon: 'FileText',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Meta-Compatible Responses and Errors',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Success Response',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "messaging_product": "whatsapp",
  "contacts": [
    {
      "input": "918888888888",
      "wa_id": "918888888888"
    }
  ],
  "messages": [
    {
      "id": "wamid.xxxxx"
    }
  ],
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
        label: '200 OK',
      },
      {
        type: 'paragraph',
        text: 'The response keeps the Meta-compatible messaging_product, contacts, and messages shape, with Whats91 metadata added for tracing.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Validation Rules',
      },
      {
        type: 'list',
        items: [
          'Authorization: Bearer or JSON auth token fields are required.',
          'The request body must be JSON.',
          'to is required.',
          'type defaults to text when omitted.',
          'A supplied type requires its matching object.',
          'Number-scoped tokens can only use their assigned phoneNumberId.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Error Codes',
      },
      {
        type: 'table',
        headers: ['HTTP', 'Error code', 'Meaning'],
        rows: [
          ['401', 'MISSING_BEARER_TOKEN', 'Missing public API token.'],
          ['401', 'INVALID_PUBLIC_API_TOKEN', 'Invalid, expired, revoked, or inactive token.'],
          ['403', 'SENDER_NOT_ALLOWED', 'Number-scoped token requested another sender.'],
          ['404', 'PHONE_NUMBER_NOT_FOUND', 'Path phoneNumberId is not connected to the authenticated customer.'],
          ['400', 'MISSING_TO', 'to is missing.'],
          ['400', 'MISSING_TYPE_OBJECT', 'Payload type requires a matching object.'],
          ['400', 'UNSUPPORTED_MESSAGE_TYPE', 'Unsupported Meta-compatible message type.'],
          ['415', 'UNSUPPORTED_CONTENT_TYPE', 'Request is not JSON.'],
        ],
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "error": {
    "message": "Missing required parameter: to",
    "type": "Whats91PublicApiException",
    "code": "MISSING_TO"
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
        label: 'Error response',
      },
    ],
  },

  // =========================================================================
  // TEMPLATE
  // =========================================================================
  {
    id: 'template-marketing',
    title: 'Marketing',
    slug: 'marketing',
    description: 'Create MARKETING templates for offers, promotions, launches, and customer engagement campaigns.',
    category: 'template',
    icon: 'FileText',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Marketing Template Creation',
      },
      {
        type: 'paragraph',
        text: 'Use MARKETING templates for offers, announcements, product launches, coupons, events, and promotional journeys. Whats91 validates the template locally, stores the request, uploads any media header privately, and submits only Meta-supported fields to Meta for review.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Create Marketing Template API',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: POST /api/v2/templates.',
      },
      {
        type: 'table',
        headers: ['Header', 'Required', 'Description'],
        rows: [
          ['Authorization', 'Yes', 'Use Authorization: Bearer w91_public_token_here. Compatibility body fields authToken, auth_token, or token are also accepted.'],
          ['Content-Type', 'Yes', 'Use application/json for text and public media URL templates. Use multipart/form-data when uploading a local header media file.'],
        ],
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/templates',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender number. Omit when the token resolves to one default or number-scoped sender.' },
          { name: 'template.name', type: 'string', required: true, description: 'Template name. Whats91 normalizes it to lowercase snake_case before submission.' },
          { name: 'template.category', type: 'string', required: true, description: 'Must be MARKETING for this page.' },
          { name: 'template.language', type: 'string', required: true, description: 'Language code such as en. Use the same language you want Meta to review.' },
          { name: 'template.body.text', type: 'string', required: true, description: 'Marketing message body. Variables use positional placeholders such as {{1}}.' },
          { name: 'template.body.examples', type: 'array', required: true, description: 'Example values for body placeholders. Required when the body contains variables.' },
          { name: 'template.header', type: 'object', required: false, description: 'Optional TEXT, IMAGE, VIDEO, or DOCUMENT header. Media headers need mediaUrl or multipart mediaFile.' },
          { name: 'template.footer.text', type: 'string', required: false, description: 'Optional short footer text.' },
          { name: 'template.buttons', type: 'array', required: false, description: 'Optional URL, PHONE_NUMBER, or QUICK_REPLY buttons supported by Meta for marketing use cases.' },
          { name: 'template.metadata', type: 'object', required: false, description: 'Local Whats91 metadata stored under temp_data.public_api.metadata and not sent to Meta.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/templates" \\
  -H "Authorization: Bearer w91_public_token_here" \\
  -H "Content-Type: application/json" \\
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
  }'`,
            label: 'Marketing create request',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Template submitted to Meta",
  "data": {
    "templateUid": "0e6fb4f1-5a60-4d1d-8ef2-61a6ec8b7103",
    "templateId": "w91_1780300000000_ab12cd34",
    "requestedTemplateName": "festival_offer_v1",
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
}`,
            label: 'Success Response',
          },
          {
            language: 'json',
            code: `{
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
}`,
            label: 'Validation Error Response',
          },
          {
            language: 'json',
            code: `{
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
}`,
            label: 'Meta Rejection Error Response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Required fields',
      },
      {
        type: 'table',
        headers: ['Field', 'Type', 'Notes'],
        rows: [
          ['template.name', 'string', 'Use a unique, readable name. Whats91 normalizes names to lowercase snake_case.'],
          ['template.category', 'string', 'Use MARKETING. Unsupported categories return VALIDATION_FAILED.'],
          ['template.language', 'string', 'Use a supported Meta language code such as en.'],
          ['template.body.text', 'string', 'Must not start or end with a variable. Add examples for every placeholder.'],
          ['template.body.examples', 'array', 'Required when body text contains {{1}}, {{2}}, or later placeholders.'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Optional fields',
      },
      {
        type: 'table',
        headers: ['Field', 'Type', 'Notes'],
        rows: [
          ['senderId', 'string', 'Selects the WhatsApp sender number when the token can access multiple senders.'],
          ['template.header', 'object', 'TEXT, IMAGE, VIDEO, or DOCUMENT. Use mediaUrl for public HTTPS media or multipart mediaFile for local files.'],
          ['template.footer.text', 'string', 'Short footer shown below the message body.'],
          ['template.buttons', 'array', 'Use URL, PHONE_NUMBER, or QUICK_REPLY buttons for clear marketing actions.'],
          ['template.metadata', 'object', 'Stored locally by Whats91 and never sent to Meta.'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Practical Marketing Examples',
      },
      {
        type: 'heading',
        level: 3,
        text: '1. Festival offer with URL button',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "senderId": "916268662275",
  "template": {
    "name": "festival_offer_v1",
    "category": "MARKETING",
    "language": "en",
    "body": {
      "text": "Hello {{1}}, our festive offer is live. Save {{2}} until {{3}}.",
      "examples": ["Devendar", "20%", "Sunday"]
    },
    "buttons": [
      { "type": "URL", "text": "Shop now", "url": "https://example.com/offers" }
    ]
  }
}`,
        label: 'Request body',
      },
      {
        type: 'heading',
        level: 3,
        text: '2. Flash sale alert',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "flash_sale_alert",
    "category": "MARKETING",
    "language": "en",
    "body": {
      "text": "Hi {{1}}, flash sale starts at {{2}}. Use code {{3}} before stock runs out.",
      "examples": ["Devendar", "6 PM", "FLASH20"]
    },
    "footer": { "text": "Limited period offer" },
    "buttons": [
      { "type": "URL", "text": "View sale", "url": "https://example.com/sale" }
    ]
  }
}`,
        label: 'Request body',
      },
      {
        type: 'heading',
        level: 3,
        text: '3. New product launch with image header',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "new_product_launch",
    "category": "MARKETING",
    "language": "en",
    "header": {
      "type": "IMAGE",
      "mediaUrl": "https://cdn.example.com/products/launch.jpg"
    },
    "body": {
      "text": "Introducing {{1}}. Explore launch benefits and early access pricing today.",
      "examples": ["Whats91 Campaign Studio"]
    },
    "buttons": [
      { "type": "URL", "text": "Explore", "url": "https://example.com/product" }
    ]
  }
}`,
        label: 'Request body',
      },
      {
        type: 'heading',
        level: 3,
        text: '4. Cart recovery offer',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "cart_recovery_offer",
    "category": "MARKETING",
    "language": "en",
    "body": {
      "text": "Hi {{1}}, items in your cart are waiting. Complete checkout and get {{2}} off.",
      "examples": ["Devendar", "10%"]
    },
    "buttons": [
      {
        "type": "URL",
        "text": "Checkout",
        "url": "https://example.com/cart/{{1}}",
        "example": "https://example.com/cart/CART-1001"
      }
    ]
  }
}`,
        label: 'Request body',
      },
      {
        type: 'heading',
        level: 3,
        text: '5. Loyalty coupon',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "loyalty_coupon",
    "category": "MARKETING",
    "language": "en",
    "body": {
      "text": "Hello {{1}}, your loyalty coupon {{2}} is ready. Redeem it before {{3}}.",
      "examples": ["Devendar", "LOYAL500", "31 March"]
    },
    "buttons": [
      { "type": "QUICK_REPLY", "text": "Use coupon" }
    ]
  }
}`,
        label: 'Request body',
      },
      {
        type: 'heading',
        level: 3,
        text: '6. Event invitation with video header',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "event_invitation",
    "category": "MARKETING",
    "language": "en",
    "header": {
      "type": "VIDEO",
      "mediaUrl": "https://cdn.example.com/events/invite.mp4"
    },
    "body": {
      "text": "Hi {{1}}, you are invited to {{2}} on {{3}}.",
      "examples": ["Devendar", "Whats91 Connect", "Friday"]
    },
    "buttons": [
      { "type": "URL", "text": "Register", "url": "https://example.com/events" }
    ],
    "metadata": {
      "clientReferenceId": "event-template-2026"
    }
  }
}`,
        label: 'Request body',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'template-utility',
    title: 'Utility',
    slug: 'utility',
    description: 'Create UTILITY templates for transactional updates, invoices, reminders, appointments, orders, and service notifications.',
    category: 'template',
    icon: 'FileText',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Utility Template Creation',
      },
      {
        type: 'paragraph',
        text: 'Use UTILITY templates for account, order, invoice, appointment, ticket, and service updates. These templates should be transactional and tied to an existing customer action or relationship.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Create Utility Template API',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: POST /api/v2/templates.',
      },
      {
        type: 'table',
        headers: ['Header', 'Required', 'Description'],
        rows: [
          ['Authorization', 'Yes', 'Use Authorization: Bearer w91_public_token_here. Compatibility body fields authToken, auth_token, or token are also accepted.'],
          ['Content-Type', 'Yes', 'Use application/json for text and public media URL templates. Use multipart/form-data when uploading a local header media file as mediaFile.'],
        ],
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/templates',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender number. Number-scoped tokens can only create templates for the assigned sender.' },
          { name: 'template.name', type: 'string', required: true, description: 'Template name. Must be unique for the selected sender.' },
          { name: 'template.category', type: 'string', required: true, description: 'Must be UTILITY for this page.' },
          { name: 'template.language', type: 'string', required: true, description: 'Language code such as en.' },
          { name: 'template.body.text', type: 'string', required: true, description: 'Transactional template body using {{1}}, {{2}}, and later placeholders when needed.' },
          { name: 'template.body.examples', type: 'array', required: true, description: 'Example values for each body placeholder.' },
          { name: 'template.header.mediaUrl', type: 'string', required: false, description: 'Public HTTPS URL for IMAGE, VIDEO, or DOCUMENT header media.' },
          { name: 'mediaFile', type: 'file', required: false, description: 'Multipart local header media file. Required when using media headers without header.mediaUrl.' },
          { name: 'template.buttons', type: 'array', required: false, description: 'Optional URL, PHONE_NUMBER, or QUICK_REPLY buttons for transactional actions.' },
          { name: 'template.metadata', type: 'object', required: false, description: 'Local Whats91 metadata, not submitted to Meta.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/templates" \\
  -H "Authorization: Bearer w91_public_token_here" \\
  -H "Content-Type: application/json" \\
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
  }'`,
            label: 'Utility create request',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Template submitted to Meta",
  "data": {
    "templateUid": "0e6fb4f1-5a60-4d1d-8ef2-61a6ec8b7103",
    "templateId": "w91_1780300000000_ab12cd34",
    "templateName": "payment_reminder_v1",
    "normalizedTemplateName": "payment_reminder_v1",
    "category": "UTILITY",
    "language": "en",
    "status": "PENDING",
    "senderId": "916268662275",
    "phoneNumberId": "1043189608869917",
    "wabaId": "643703032991069",
    "metaSubmission": {
      "submitted": true,
      "status": "PENDING"
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid",
    "processingTimeMs": 320
  }
}`,
            label: 'Success Response',
          },
          {
            language: 'json',
            code: `{
  "success": false,
  "message": "Header media is required for DOCUMENT template header",
  "error_code": "MISSING_HEADER_MEDIA",
  "details": {
    "headerType": "DOCUMENT",
    "acceptedInputs": ["mediaFile", "template.header.mediaUrl"]
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Validation Error Response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Required fields',
      },
      {
        type: 'table',
        headers: ['Field', 'Type', 'Notes'],
        rows: [
          ['template.name', 'string', 'Unique template name for the selected sender.'],
          ['template.category', 'string', 'Use UTILITY. Promotional language should move to MARKETING.'],
          ['template.language', 'string', 'Supported Meta language code such as en.'],
          ['template.body.text', 'string', 'Transactional message body. Variables require examples.'],
          ['template.body.examples', 'array', 'Required when body text uses placeholders.'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Optional fields',
      },
      {
        type: 'table',
        headers: ['Field', 'Type', 'Notes'],
        rows: [
          ['senderId', 'string', 'Explicit sender number for global or multi-number tokens.'],
          ['template.header', 'object', 'TEXT, IMAGE, VIDEO, or DOCUMENT header.'],
          ['header.mediaUrl', 'string', 'Public HTTPS media URL for IMAGE, VIDEO, or DOCUMENT headers.'],
          ['mediaFile', 'file', 'Multipart local file alternative for media headers.'],
          ['template.footer.text', 'string', 'Optional footer for operational context.'],
          ['template.buttons', 'array', 'URL, PHONE_NUMBER, or QUICK_REPLY actions.'],
          ['template.metadata', 'object', 'Internal reference values stored locally by Whats91.'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Practical Utility Examples',
      },
      {
        type: 'heading',
        level: 3,
        text: '1. Payment reminder',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "payment_reminder_v1",
    "category": "UTILITY",
    "language": "en",
    "body": {
      "text": "Hello {{1}}, payment for invoice {{2}} is due on {{3}}.",
      "examples": ["Devendar", "INV-1001", "31 March"]
    }
  }
}`,
        label: 'Request body',
      },
      {
        type: 'heading',
        level: 3,
        text: '2. Invoice ready with PDF header',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "invoice_ready_pdf",
    "category": "UTILITY",
    "language": "en",
    "header": {
      "type": "DOCUMENT",
      "mediaUrl": "https://cdn.example.com/invoices/sample-invoice.pdf"
    },
    "body": {
      "text": "Hi {{1}}, your invoice {{2}} is ready for download.",
      "examples": ["Devendar", "INV-1001"]
    },
    "buttons": [
      {
        "type": "URL",
        "text": "View invoice",
        "url": "https://example.com/invoices/{{1}}",
        "example": "https://example.com/invoices/INV-1001"
      }
    ]
  }
}`,
        label: 'Request body',
      },
      {
        type: 'heading',
        level: 3,
        text: '3. Shipping update',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "shipping_update",
    "category": "UTILITY",
    "language": "en",
    "header": { "type": "TEXT", "text": "Shipping update" },
    "body": {
      "text": "Your package {{1}} is now {{2}}. Expected delivery: {{3}}.",
      "examples": ["AWB-12345", "out for delivery", "today"]
    },
    "buttons": [
      {
        "type": "URL",
        "text": "Track",
        "url": "https://example.com/track/{{1}}",
        "example": "https://example.com/track/AWB-12345"
      }
    ]
  }
}`,
        label: 'Request body',
      },
      {
        type: 'heading',
        level: 3,
        text: '4. Appointment confirmation',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "appointment_confirmation",
    "category": "UTILITY",
    "language": "en",
    "body": {
      "text": "Hi {{1}}, your appointment with {{2}} is confirmed for {{3}}.",
      "examples": ["Devendar", "Whats91 Support", "10:30 AM"]
    },
    "buttons": [
      { "type": "QUICK_REPLY", "text": "Confirm" },
      { "type": "QUICK_REPLY", "text": "Reschedule" }
    ]
  }
}`,
        label: 'Request body',
      },
      {
        type: 'heading',
        level: 3,
        text: '5. Order status update',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "order_status_update",
    "category": "UTILITY",
    "language": "en",
    "body": {
      "text": "Order {{1}} has moved to {{2}}. We will notify you when the next update is available.",
      "examples": ["ORD-1001", "packed"]
    },
    "footer": { "text": "Order updates from Whats91" }
  }
}`,
        label: 'Request body',
      },
      {
        type: 'heading',
        level: 3,
        text: '6. Service ticket update',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "service_ticket_update",
    "category": "UTILITY",
    "language": "en",
    "body": {
      "text": "Ticket {{1}} is now {{2}}. Assigned team: {{3}}.",
      "examples": ["TKT-9001", "in progress", "Cloud API Support"]
    },
    "buttons": [
      { "type": "PHONE_NUMBER", "text": "Call support", "phone_number": "+919999999999" }
    ],
    "metadata": {
      "clientReferenceId": "service-template-001"
    }
  }
}`,
        label: 'Request body',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'template-authentication',
    title: 'Authentication',
    slug: 'authentication',
    description: 'Create AUTHENTICATION templates for OTP and verification code delivery using Meta copy-code buttons.',
    category: 'template',
    icon: 'FileText',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Authentication Template Creation',
      },
      {
        type: 'paragraph',
        text: 'Authentication templates are for one-time passwords, login verification, account recovery, and transaction confirmation codes. Use Meta copy-code OTP format and keep the template focused on the verification action.',
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'Do not include URLs, emojis, headers, footers, or non-copy-code buttons in AUTHENTICATION templates. Use one COPY_CODE button with an example code.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Account age eligibility',
      },
      {
        type: 'paragraph',
        text: 'Authentication template creation is restricted for newly created accounts. By default, the account must be at least 14 days old before AUTHENTICATION templates can be created, or account meta must contain an authenticationTemplateEligibleAt value that is already in the past.',
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'The API must verify account age from trusted account meta on the server. Any request-supplied account age is ignored, so clients cannot bypass this restriction by sending their own creation date or eligibility flag.',
      },
      {
        type: 'table',
        headers: ['Account meta field', 'Required', 'Notes'],
        rows: [
          ['accountMeta.createdAt', 'Yes', 'Server-side account creation timestamp used to calculate account age.'],
          ['accountMeta.authenticationTemplateEligibleAt', 'Optional', 'Explicit server-side eligibility timestamp. If present, AUTHENTICATION templates are allowed only after this value is in the past.'],
          ['template.metadata.accountAge', 'No', 'Ignored. Client-provided age or eligibility values are not trusted.'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Create Authentication Template API',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: POST /api/v2/templates.',
      },
      {
        type: 'table',
        headers: ['Header', 'Required', 'Description'],
        rows: [
          ['Authorization', 'Yes', 'Use Authorization: Bearer w91_public_token_here. Compatibility body fields authToken, auth_token, or token are also accepted.'],
          ['Content-Type', 'Yes', 'Use application/json. Authentication templates do not use media headers.'],
        ],
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/templates',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender number. Omit when token scope can resolve the sender.' },
          { name: 'template.name', type: 'string', required: true, description: 'Unique authentication template name.' },
          { name: 'template.category', type: 'string', required: true, description: 'Must be AUTHENTICATION for this page.' },
          { name: 'template.language', type: 'string', required: true, description: 'Language code such as en.' },
          { name: 'template.buttons[0].type', type: 'string', required: true, description: 'Use COPY_CODE.' },
          { name: 'template.buttons[0].example', type: 'string', required: true, description: 'Example OTP or verification code such as 123456.' },
          { name: 'template.metadata', type: 'object', required: false, description: 'Local Whats91 reference metadata, not submitted to Meta.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/templates" \\
  -H "Authorization: Bearer w91_public_token_here" \\
  -H "Content-Type: application/json" \\
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
  }'`,
            label: 'Authentication create request',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Template submitted to Meta",
  "data": {
    "templateUid": "0e6fb4f1-5a60-4d1d-8ef2-61a6ec8b7103",
    "templateId": "w91_1780300000000_ab12cd34",
    "templateName": "login_otp_v1",
    "normalizedTemplateName": "login_otp_v1",
    "category": "AUTHENTICATION",
    "language": "en",
    "status": "PENDING",
    "senderId": "916268662275",
    "phoneNumberId": "1043189608869917",
    "wabaId": "643703032991069"
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid",
    "processingTimeMs": 320
  }
}`,
            label: 'Success Response',
          },
          {
            language: 'json',
            code: `{
  "success": false,
  "message": "Authentication templates only support COPY_CODE buttons",
  "error_code": "VALIDATION_FAILED",
  "details": {
    "field": "template.buttons",
    "allowedButtonType": "COPY_CODE"
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Validation Error Response',
          },
          {
            language: 'json',
            code: `{
  "success": false,
  "message": "Authentication template creation is restricted for newly created accounts",
  "error_code": "AUTHENTICATION_TEMPLATE_ACCOUNT_AGE_RESTRICTED",
  "details": {
    "requiredMinimumAgeDays": 14,
    "accountAgeDays": 3,
    "accountMetaSource": "account meta",
    "authenticationTemplateEligibleAt": "2026-06-21T00:00:00.000Z"
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Account Age Restriction Error Response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Required fields',
      },
      {
        type: 'table',
        headers: ['Field', 'Type', 'Notes'],
        rows: [
          ['template.name', 'string', 'Unique name for the OTP or verification template.'],
          ['template.category', 'string', 'Use AUTHENTICATION.'],
          ['template.language', 'string', 'Supported Meta language code such as en.'],
          ['template.buttons[0].type', 'string', 'Use COPY_CODE only.'],
          ['template.buttons[0].example', 'string', 'Example code value used for Meta review.'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Optional fields',
      },
      {
        type: 'table',
        headers: ['Field', 'Type', 'Notes'],
        rows: [
          ['senderId', 'string', 'Explicit sender number for multi-number tokens.'],
          ['template.metadata', 'object', 'Local integration reference data stored by Whats91.'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Practical Authentication Examples',
      },
      {
        type: 'heading',
        level: 3,
        text: '1. Login OTP',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "login_otp_v1",
    "category": "AUTHENTICATION",
    "language": "en",
    "buttons": [
      { "type": "COPY_CODE", "example": "123456" }
    ]
  }
}`,
        label: 'Request body',
      },
      {
        type: 'heading',
        level: 3,
        text: '2. Signup verification',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "signup_verification",
    "category": "AUTHENTICATION",
    "language": "en",
    "buttons": [
      { "type": "COPY_CODE", "example": "489201" }
    ]
  }
}`,
        label: 'Request body',
      },
      {
        type: 'heading',
        level: 3,
        text: '3. Password reset code',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "password_reset_code",
    "category": "AUTHENTICATION",
    "language": "en",
    "buttons": [
      { "type": "COPY_CODE", "example": "752904" }
    ],
    "metadata": {
      "clientReferenceId": "password-reset-template"
    }
  }
}`,
        label: 'Request body',
      },
      {
        type: 'heading',
        level: 3,
        text: '4. Transaction PIN code',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "transaction_pin_code",
    "category": "AUTHENTICATION",
    "language": "en",
    "buttons": [
      { "type": "COPY_CODE", "example": "908172" }
    ]
  }
}`,
        label: 'Request body',
      },
      {
        type: 'heading',
        level: 3,
        text: '5. Account recovery code',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "account_recovery_code",
    "category": "AUTHENTICATION",
    "language": "en",
    "buttons": [
      { "type": "COPY_CODE", "example": "650219" }
    ]
  }
}`,
        label: 'Request body',
      },
      {
        type: 'heading',
        level: 3,
        text: '6. Two-step login code',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "template": {
    "name": "two_step_login_code",
    "category": "AUTHENTICATION",
    "language": "en",
    "buttons": [
      { "type": "COPY_CODE", "example": "341875" }
    ],
    "metadata": {
      "clientReferenceId": "two-step-login"
    }
  }
}`,
        label: 'Request body',
      },
    ],
  },

  // =========================================================================
  // WEBHOOK
  // =========================================================================
  {
    id: 'webhook-create',
    title: 'Create',
    slug: 'create',
    description: 'Create and manage Whats91 Webhooks v2 event destinations with the canonical public API route.',
    category: 'webhook',
    icon: 'Webhook',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Create Webhook',
      },
      {
        type: 'paragraph',
        text: 'Whats91 Webhooks v2 deliver real-time WhatsApp events to your HTTPS endpoint. Public API v2 webhook management uses /api/v2/webhooks only; these APIs manage Whats91 outbound event destinations and do not change Meta callback override URLs or legacy Cloud API setup fields.',
      },
      {
        type: 'cards',
        cards: [
          {
            title: 'Canonical route',
            value: '/api/v2/webhooks',
            description: 'Use the graph.whats91.com API v2 path for create, list, get, and update.',
            tone: 'green',
          },
          {
            title: 'Sender scoped',
            value: 'senderId',
            description: 'Omit senderId for default token resolution, or pass it when a token can access multiple senders.',
            tone: 'blue',
          },
          {
            title: 'Secret handling',
            value: 'Create only',
            description: 'The signing secret is returned once when the webhook is created and is never returned by list, get, or update.',
            tone: 'amber',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Authentication',
      },
      {
        type: 'paragraph',
        text: 'Send the public API token in the Authorization header. For POST compatibility, authToken, auth_token, or token can also be sent in the JSON body.',
      },
      {
        type: 'code',
        language: 'http',
        code: 'Authorization: Bearer w91_public_token_here',
        label: 'Authorization header',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Event Catalog',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/webhooks/events. Fetch the event catalog before creating a webhook so your integration subscribes only to supported event keys.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/webhooks/events',
        request: [
          {
            language: 'curl',
            code: `curl -X GET "https://graph.whats91.com/api/v2/webhooks/events" \\
  -H "Authorization: Bearer w91_public_token_here"`,
            label: 'Get event catalog',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
}`,
            label: 'Event catalog response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Create Webhook API',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: POST /api/v2/webhooks.',
      },
      {
        type: 'table',
        headers: ['Header', 'Required', 'Description'],
        rows: [
          ['Authorization', 'Yes', 'Use Authorization: Bearer w91_public_token_here.'],
          ['Content-Type', 'Yes', 'Use Content-Type: application/json for create and update requests.'],
        ],
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/webhooks',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender number. Number-scoped tokens can only manage webhooks for the assigned sender.' },
          { name: 'webhook.name', type: 'string', required: true, description: 'Developer-facing webhook name.' },
          { name: 'webhook.endpointUrl', type: 'string', required: true, description: 'HTTPS destination URL that receives Whats91 event deliveries.' },
          { name: 'webhook.events', type: 'array', required: true, description: 'Supported event keys from GET /api/v2/webhooks/events.' },
          { name: 'webhook.status', type: 'string', required: false, description: 'ACTIVE or INACTIVE. Defaults to ACTIVE when omitted.' },
          { name: 'webhook.timeoutMs', type: 'number', required: false, description: 'Delivery timeout in milliseconds, such as 5000.' },
          { name: 'webhook.retryEnabled', type: 'boolean', required: false, description: 'Whether Whats91 should retry failed deliveries.' },
          { name: 'webhook.retryMaxAttempts', type: 'number', required: false, description: 'Maximum retry attempts when retryEnabled is true.' },
          { name: 'webhook.verificationHeaderKey', type: 'string', required: false, description: 'Custom header name Whats91 sends with the verification token.' },
          { name: 'webhook.verificationToken', type: 'string', required: false, description: 'Shared verification token stored encrypted/hashed and never returned by public APIs.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/webhooks" \\
  -H "Authorization: Bearer w91_public_token_here" \\
  -H "Content-Type: application/json" \\
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
  }'`,
            label: 'Create webhook request',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
}`,
            label: 'Success Response',
          },
          {
            language: 'json',
            code: `{
  "success": false,
  "message": "Unsupported webhook event: message.invalid",
  "error_code": "VALIDATION_FAILED",
  "details": {},
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Validation Error Response',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'signingSecret is returned only on create. Store it immediately. List, get, and update responses never return the signing secret, encrypted secret, verification token, or token hash.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Required fields',
      },
      {
        type: 'table',
        headers: ['Field', 'Type', 'Notes'],
        rows: [
          ['webhook.name', 'string', 'Readable name for the destination.'],
          ['webhook.endpointUrl', 'string', 'HTTPS endpoint URL in production. Local development URLs are allowed only where Whats91 validation allows them.'],
          ['webhook.events', 'array', 'One or more supported event keys from the event catalog.'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Optional fields',
      },
      {
        type: 'table',
        headers: ['Field', 'Type', 'Notes'],
        rows: [
          ['senderId', 'string', 'Sender WhatsApp number for multi-number customers.'],
          ['webhook.status', 'string', 'ACTIVE or INACTIVE. Use INACTIVE to disable a webhook.'],
          ['webhook.timeoutMs', 'number', 'Delivery timeout in milliseconds.'],
          ['webhook.retryEnabled', 'boolean', 'Enables retries for failed deliveries.'],
          ['webhook.retryMaxAttempts', 'number', 'Maximum delivery retry attempts.'],
          ['webhook.verificationHeaderKey', 'string', 'Custom verification header key, such as X-CRM-Webhook-Token.'],
          ['webhook.verificationToken', 'string', 'Custom shared token sent in the verification header.'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Management endpoints',
      },
      {
        type: 'table',
        headers: ['Action', 'Method', 'Endpoint', 'Notes'],
        rows: [
          ['List webhooks', 'GET', '/api/v2/webhooks', 'Filter by senderId, status, event, page, and limit.'],
          ['Get one webhook', 'GET', '/api/v2/webhooks/:webhookUid', 'webhookUid is the only public identifier for retrieval.'],
          ['Update webhook', 'POST', '/api/v2/webhooks/:webhookUid', 'All webhook fields are optional, but at least one update field is required.'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Validation errors',
      },
      {
        type: 'table',
        headers: ['Status', 'Error code', 'When it happens'],
        rows: [
          ['401', 'MISSING_AUTH_TOKEN', 'No public API token was supplied.'],
          ['401', 'INVALID_AUTH_TOKEN', 'Token is missing, expired, revoked, or not tied to an active customer.'],
          ['403', 'FEATURE_NOT_AVAILABLE', 'The subscription does not include Webhooks v2.'],
          ['400', 'WHATSAPP_SETUP_INCOMPLETE', 'Whats91 cannot resolve a sender context.'],
          ['400', 'VALIDATION_FAILED', 'Invalid name, empty events, unsupported event, invalid status, invalid timeout/retry values, invalid verification header, or missing update fields.'],
          ['400', 'WEBHOOK_ENDPOINT_INVALID', 'The endpoint URL is malformed.'],
          ['400', 'WEBHOOK_ENDPOINT_REQUIRES_HTTPS', 'The endpoint is not HTTPS in a production context.'],
          ['404', 'WEBHOOK_NOT_FOUND', 'The UID does not belong to the authenticated customer and resolved sender.'],
          ['415', 'UNSUPPORTED_CONTENT_TYPE', 'POST request is not JSON.'],
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'webhook-samples',
    title: 'Samples',
    slug: 'samples',
    description: 'Webhook management requests, responses, and event payload samples for common Whats91 webhook flows.',
    category: 'webhook',
    icon: 'Webhook',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Webhook Samples',
      },
      {
        type: 'paragraph',
        text: 'Use these samples when wiring the management API and building receivers for Whats91 event deliveries.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'List Webhooks',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/webhooks. Optional query parameters are senderId, status, event, page, and limit.',
      },
      {
        type: 'code',
        language: 'curl',
        code: `curl -X GET "https://graph.whats91.com/api/v2/webhooks?senderId=916268662275&status=ACTIVE&event=message.inbound.text" \\
  -H "Authorization: Bearer w91_public_token_here"`,
        label: 'List active webhooks',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
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
}`,
        label: 'List response',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Get One Webhook',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/webhooks/:webhookUid. Use the existing uid returned as webhookUid.',
      },
      {
        type: 'code',
        language: 'curl',
        code: `curl -X GET "https://graph.whats91.com/api/v2/webhooks/wh_abc?senderId=916268662275" \\
  -H "Authorization: Bearer w91_public_token_here"`,
        label: 'Get webhook',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Update Webhook',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: POST /api/v2/webhooks/:webhookUid. Updates use POST so integrations only need GET and POST.',
      },
      {
        type: 'code',
        language: 'curl',
        code: `curl -X POST "https://graph.whats91.com/api/v2/webhooks/wh_abc" \\
  -H "Authorization: Bearer w91_public_token_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "senderId": "916268662275",
    "webhook": {
      "status": "INACTIVE",
      "retryEnabled": false
    }
  }'`,
        label: 'Disable webhook',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "webhook": {
    "verificationToken": "new-shared-secret"
  }
}`,
        label: 'Update verification token',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "webhook": {
    "clearVerificationToken": true
  }
}`,
        label: 'Clear verification token',
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Updating a webhook does not rotate the signing secret. Create a new webhook if you need a fresh signing secret.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Event Payload Samples',
      },
      {
        type: 'table',
        headers: ['Event key', 'Use it for', 'Typical consumer'],
        rows: [
          ['message.inbound.text', 'Incoming text messages from customers.', 'CRM, support inbox, chatbot.'],
          ['message.status.delivered', 'Delivery confirmation for sent messages.', 'Order timeline, campaign reports.'],
          ['message.status.failed', 'Delivery failure tracking.', 'Alerting and retry workflows.'],
          ['template.status_update', 'Template review status changes.', 'Template operations dashboard.'],
        ],
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "event": "message.inbound.text",
  "webhookUid": "wh_abc",
  "senderId": "916268662275",
  "data": {
    "from": "919888888888",
    "messageId": "wamid.HBgMOTE5...",
    "text": "I need help with my order",
    "timestamp": "2026-06-05T10:30:00.000Z"
  }
}`,
        label: 'Inbound text payload',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "event": "message.status.delivered",
  "webhookUid": "wh_abc",
  "senderId": "916268662275",
  "data": {
    "messageId": "wamid.HBgMOTE5...",
    "recipient": "919888888888",
    "status": "delivered",
    "timestamp": "2026-06-05T10:31:00.000Z"
  }
}`,
        label: 'Delivered status payload',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
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
}`,
        label: 'Failed status payload',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "event": "template.status_update",
  "webhookUid": "wh_abc",
  "senderId": "916268662275",
  "data": {
    "templateName": "payment_reminder_v1",
    "category": "UTILITY",
    "language": "en",
    "status": "APPROVED"
  }
}`,
        label: 'Template status payload',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Error Samples',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "success": false,
  "message": "Missing authorization token",
  "error_code": "MISSING_AUTH_TOKEN",
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
        label: 'Missing token error',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "success": false,
  "message": "Unsupported webhook event: message.invalid",
  "error_code": "VALIDATION_FAILED",
  "details": {},
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
        label: 'Validation error',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'webhook-examples',
    title: 'Examples',
    slug: 'examples',
    description: 'Practical webhook receiver examples and use cases for CRM, delivery tracking, and template operations.',
    category: 'webhook',
    icon: 'Webhook',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Webhook Examples',
      },
      {
        type: 'paragraph',
        text: 'These examples show how teams usually connect Whats91 Webhooks v2 to application workflows after creating a destination.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Use Cases',
      },
      {
        type: 'cards',
        cards: [
          {
            title: 'CRM handoff',
            value: 'message.inbound.text',
            description: 'Create or update a CRM conversation when a customer sends a new WhatsApp message.',
            tone: 'green',
          },
          {
            title: 'Delivery status sync',
            value: 'message.status.delivered',
            description: 'Update order, invoice, or campaign timelines when Whats91 receives message status events.',
            tone: 'blue',
          },
          {
            title: 'Template review alerts',
            value: 'template.status_update',
            description: 'Notify operations teams when a template is approved, rejected, paused, or needs review.',
            tone: 'amber',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Node.js receiver',
      },
      {
        type: 'paragraph',
        text: 'This receiver validates the custom verification header, parses the event, shows how to respond with 200 quickly, and then routes the work asynchronously.',
      },
      {
        type: 'code',
        language: 'javascript',
        code: `import express from 'express';
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
});`,
        label: 'Node.js receiver',
      },
      {
        type: 'callout',
        variant: 'tip',
        text: 'Keep the request handler fast. Acknowledge the webhook first, then process CRM writes, notifications, and analytics updates in a queue or background job.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'CRM handoff example',
      },
      {
        type: 'code',
        language: 'javascript',
        code: `async function handleWebhook(payload) {
  if (payload.event !== 'message.inbound.text') return;

  await crm.conversations.upsert({
    phone: payload.data.from,
    source: 'whats91',
    lastMessage: payload.data.text,
    externalMessageId: payload.data.messageId,
    receivedAt: payload.data.timestamp,
  });
}`,
        label: 'CRM inbound handler',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Delivery status sync example',
      },
      {
        type: 'code',
        language: 'javascript',
        code: `async function syncDeliveryStatus(payload) {
  if (!payload.event.startsWith('message.status.')) return;

  await messageReports.updateByMetaMessageId(payload.data.messageId, {
    status: payload.data.status,
    recipient: payload.data.recipient,
    updatedAt: payload.data.timestamp,
  });
}`,
        label: 'Status sync handler',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Template review alerts example',
      },
      {
        type: 'code',
        language: 'javascript',
        code: `async function notifyTemplateReview(payload) {
  if (payload.event !== 'template.status_update') return;

  await notifications.send({
    channel: 'template-ops',
    title: 'Template status changed',
    message: payload.data.templateName + ' is now ' + payload.data.status,
  });
}`,
        label: 'Template status handler',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Operational checklist',
      },
      {
        type: 'list',
        items: [
          'Create the webhook with status ACTIVE only after the receiver endpoint is deployed.',
          'Store WHATS91_WEBHOOK_SIGNING_SECRET from the create response immediately.',
          'Use X-CRM-Webhook-Token or another verificationHeaderKey when your receiver expects a shared custom token.',
          'Subscribe only to events your application actually processes.',
          'Return HTTP 200 before long-running CRM, ERP, reporting, or notification work.',
          'Use status INACTIVE to disable a webhook; there is no public delete endpoint in this phase.',
        ],
      },
    ],
  },

  // =========================================================================
  // REPORTS
  // =========================================================================
  {
    id: 'reports-all',
    title: 'All Reports',
    slug: 'all-reports',
    description: 'List message reports with pagination, date filters, status filters, and sender scoping.',
    category: 'reports',
    icon: 'BarChart3',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'All Message Reports',
      },
      {
        type: 'paragraph',
        text: 'Public message reporting APIs are read-only JSON endpoints under the canonical reports base URL. Do not use /v2/reports; that twin path is intentionally not exposed for report management.',
      },
      {
        type: 'code',
        language: 'text',
        code: 'https://graph.whats91.com/api/v2/reports',
        label: 'Reports base URL',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Authentication',
      },
      {
        type: 'paragraph',
        text: 'Use a public API token in the Authorization header. GET endpoints also accept authToken, auth_token, or token as query parameters for compatibility.',
      },
      {
        type: 'code',
        language: 'http',
        code: 'Authorization: Bearer w91_live_xxxxxxxxxxxxxxxxx',
        label: 'Authorization header',
      },
      {
        type: 'heading',
        level: 2,
        text: 'List Messages API',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/messages.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/messages',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender phone number. Optional when token scope/default sender resolves it.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Positive integer. Default 50, max 200.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD. Defaults to the last 30 days for live message reports.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD. Defaults to today for live message reports.' },
          { name: 'storage', type: 'string', required: false, description: 'live or archive. Default live.' },
          { name: 'status', type: 'string', required: false, description: 'accepted, sent, delivered, read, failed, pending, or another supported report status.' },
          { name: 'receiver', type: 'string', required: false, description: 'Recipient phone number.' },
          { name: 'campaignUid', type: 'string', required: false, description: 'Filter reports by campaign UID.' },
          { name: 'templateName', type: 'string', required: false, description: 'Filter reports by template name.' },
          { name: 'messageType', type: 'string', required: false, description: 'template, text, image, document, or another message type.' },
          { name: 'sourceType', type: 'string', required: false, description: 'PUBLIC_API, CAMPAIGN, CHATBOT, FLOW, or another source type.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/messages?senderId=919999999999&status=delivered&limit=50" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'List delivered reports',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Message reports retrieved",
  "data": {
    "senderId": "919999999999",
    "phoneNumberId": "1234567890",
    "reports": [
      {
        "reportUid": "msg_uid",
        "messageId": "wamid.xxxxx",
        "receiver": "918888888888",
        "sourceType": "CAMPAIGN",
        "campaignUid": "campaign_uid",
        "templateName": "payment_reminder",
        "messageType": "template",
        "status": "delivered",
        "latestStatus": "delivered",
        "occurredAt": "2026-06-05T08:00:00.000Z"
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
}`,
            label: 'Success Response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Common errors',
      },
      {
        type: 'table',
        headers: ['HTTP', 'Error code', 'Meaning'],
        rows: [
          ['401', 'MISSING_AUTH_TOKEN', 'No bearer/query token was supplied.'],
          ['401', 'INVALID_AUTH_TOKEN', 'Token is invalid, expired, revoked, or user inactive.'],
          ['403', 'SENDER_NOT_ALLOWED', 'Number-scoped token attempted another sender.'],
          ['403', 'FEATURE_NOT_AVAILABLE', 'Subscription does not include the requested report feature.'],
          ['400', 'VALIDATION_FAILED', 'Invalid date range, pagination, storage, or missing required query field.'],
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'reports-message-status',
    title: 'Message Status',
    slug: 'message-status',
    description: 'Retrieve the latest status and lifecycle events for one message.',
    category: 'reports',
    icon: 'BarChart3',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Message Status Report',
      },
      {
        type: 'paragraph',
        text: 'Use this endpoint to look up one message by Meta message ID. Whats91 also accepts a local report UID or message key as a fallback.',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/messages/status.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/messages/status',
        parameters: [
          { name: 'messageId', type: 'string', required: true, description: 'Meta message ID first; local report UID or message key is accepted as a fallback.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender phone number for multi-number tokens.' },
          { name: 'storage', type: 'string', required: false, description: 'live or archive.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/messages/status?messageId=wamid.xxxxx" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Get message status',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Message status retrieved",
  "data": {
    "message": {
      "reportUid": "msg_uid",
      "messageId": "wamid.xxxxx",
      "receiver": "918888888888",
      "latestStatus": "read"
    },
    "events": [
      { "eventType": "status", "status": "sent", "occurredAt": "2026-06-05T07:59:00.000Z" },
      { "eventType": "status", "status": "read", "occurredAt": "2026-06-05T08:02:00.000Z" }
    ]
  }
}`,
            label: 'Status response',
          },
          {
            language: 'json',
            code: `{
  "success": false,
  "message": "Message not found",
  "error_code": "MESSAGE_NOT_FOUND"
}`,
            label: 'Not found response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'reports-mobile-history',
    title: 'Mobile History',
    slug: 'mobile-history',
    description: 'List message history for one recipient mobile number.',
    category: 'reports',
    icon: 'BarChart3',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Mobile Number History',
      },
      {
        type: 'paragraph',
        text: 'This endpoint returns all messages for one recipient, scoped to the authenticated sender and supporting the same pagination and filters as the message list.',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/messages/history.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/messages/history',
        parameters: [
          { name: 'mobileNumber', type: 'string', required: true, description: 'Recipient mobile number to search.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender phone number.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Positive integer. Default 50, max 200.' },
          { name: 'status', type: 'string', required: false, description: 'Message status filter.' },
          { name: 'storage', type: 'string', required: false, description: 'live or archive.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/messages/history?mobileNumber=918888888888&limit=25" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Get recipient history',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Mobile message history retrieved",
  "data": {
    "mobileNumber": "918888888888",
    "reports": [
      {
        "reportUid": "msg_uid",
        "messageId": "wamid.xxxxx",
        "receiver": "918888888888",
        "latestStatus": "delivered",
        "occurredAt": "2026-06-05T08:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 25,
      "total": 1,
      "hasMore": false
    }
  }
}`,
            label: 'History response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'reports-campaigns',
    title: 'Campaigns',
    slug: 'campaigns',
    description: 'List campaign summaries and delivery totals.',
    category: 'reports',
    icon: 'BarChart3',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Campaign Reports',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/campaigns. Returns campaign summaries with delivery counts.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/campaigns',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender phone number.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Positive integer. Default 50, max 200.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
          { name: 'status', type: 'string', required: false, description: 'Campaign status filter.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/campaigns?limit=50" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'List campaigns',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "data": {
    "totals": {
      "campaigns": 1,
      "recipients": 100,
      "sent": 90,
      "delivered": 80,
      "read": 55,
      "failed": 5,
      "pending": 5
    },
    "campaigns": [
      {
        "campaignUid": "campaign_uid",
        "name": "Payment follow up",
        "status": "COMPLETED",
        "summary": {
          "recipients": 100,
          "sent": 90,
          "delivered": 80,
          "read": 55,
          "failed": 5,
          "pending": 5
        }
      }
    ]
  }
}`,
            label: 'Campaign list response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'reports-campaign-detail',
    title: 'Campaign Detail',
    slug: 'campaign-detail',
    description: 'Retrieve one campaign summary with totals and breakdowns.',
    category: 'reports',
    icon: 'BarChart3',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Campaign Detail',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/campaigns/{campaignUid}. Returns campaign summary, totals, status breakdown, and step breakdown.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/campaigns/{campaignUid}',
        parameters: [
          { name: 'campaignUid', type: 'string', required: true, description: 'Campaign UID from the campaign list.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender phone number.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/campaigns/campaign_uid" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Get campaign detail',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "data": {
    "campaignUid": "campaign_uid",
    "summary": {
      "name": "Payment follow up",
      "status": "COMPLETED"
    },
    "totals": {
      "recipients": 100,
      "delivered": 80,
      "read": 55,
      "failed": 5
    },
    "statusBreakdown": [
      { "status": "delivered", "count": 80 },
      { "status": "failed", "count": 5 }
    ],
    "stepBreakdown": [
      { "step": "send", "count": 100 },
      { "step": "status", "count": 90 }
    ]
  }
}`,
            label: 'Campaign detail response',
          },
          {
            language: 'json',
            code: `{
  "success": false,
  "message": "Campaign not found",
  "error_code": "CAMPAIGN_NOT_FOUND"
}`,
            label: 'Not found response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'reports-campaign-messages',
    title: 'Campaign Messages',
    slug: 'campaign-messages',
    description: 'List recipient-level message rows for a campaign.',
    category: 'reports',
    icon: 'BarChart3',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Campaign Messages',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/campaigns/{campaignUid}/messages. Returns recipient/message rows for a campaign with status, Meta message ID, template, and error fields.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/campaigns/{campaignUid}/messages',
        parameters: [
          { name: 'campaignUid', type: 'string', required: true, description: 'Campaign UID from the campaign list.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender phone number.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Positive integer. Default 50, max 200.' },
          { name: 'status', type: 'string', required: false, description: 'Message status filter.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/campaigns/campaign_uid/messages?status=delivered" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'List campaign messages',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "data": {
    "campaignUid": "campaign_uid",
    "messages": [
      {
        "receiver": "918888888888",
        "messageId": "wamid.xxxxx",
        "metaMessageId": "wamid.xxxxx",
        "templateName": "payment_reminder",
        "status": "delivered",
        "error": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1
    }
  }
}`,
            label: 'Campaign messages response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'reports-campaign-timeline',
    title: 'Campaign Timeline',
    slug: 'campaign-timeline',
    description: 'Retrieve timeline events for a campaign.',
    category: 'reports',
    icon: 'BarChart3',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Campaign Timeline',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/campaigns/{campaignUid}/timeline. Returns status, webhook status, execution, interaction, unsubscribe, and related timeline events where available.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/campaigns/{campaignUid}/timeline',
        parameters: [
          { name: 'campaignUid', type: 'string', required: true, description: 'Campaign UID from the campaign list.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender phone number.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/campaigns/campaign_uid/timeline" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Get campaign timeline',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "data": {
    "campaignUid": "campaign_uid",
    "events": [
      { "type": "execution", "label": "Campaign started", "occurredAt": "2026-06-05T07:55:00.000Z" },
      { "type": "status", "status": "delivered", "count": 80, "occurredAt": "2026-06-05T08:00:00.000Z" },
      { "type": "webhook status", "status": "sent", "occurredAt": "2026-06-05T08:01:00.000Z" },
      { "type": "interaction", "intent": "payment_link_clicked", "occurredAt": "2026-06-05T08:02:00.000Z" },
      { "type": "unsubscribe", "count": 1, "occurredAt": "2026-06-05T08:03:00.000Z" }
    ]
  }
}`,
            label: 'Campaign timeline response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'reports-campaign-responses',
    title: 'Campaign Responses',
    slug: 'campaign-responses',
    description: 'Search and filter customer responses generated by campaign interactions.',
    category: 'reports',
    icon: 'BarChart3',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Campaign Responses',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/campaigns/responses.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/campaigns/responses',
        parameters: [
          { name: 'campaignUid', type: 'string', required: false, description: 'Campaign UID filter.' },
          { name: 'intent', type: 'string', required: false, description: 'Detected intent filter.' },
          { name: 'replyTitle', type: 'string', required: false, description: 'Button/list reply title filter.' },
          { name: 'replyType', type: 'string', required: false, description: 'Reply type filter.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
          { name: 'search', type: 'string', required: false, description: 'Free-text response search.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Positive integer. Default 50, max 200.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/campaigns/responses?campaignUid=campaign_uid&intent=payment" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'List campaign responses',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "data": {
    "responses": [
      {
        "campaignUid": "campaign_uid",
        "receiver": "918888888888",
        "replyType": "button",
        "replyTitle": "Pay now",
        "intent": "payment",
        "occurredAt": "2026-06-05T08:05:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1
    }
  }
}`,
            label: 'Campaign responses response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'reports-delivery-analytics',
    title: 'Delivery Analytics',
    slug: 'delivery-analytics',
    description: 'Delivery summary by status and source.',
    category: 'reports',
    icon: 'BarChart3',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Delivery Analytics',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/analytics/delivery. Delivery summary by status/source.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/analytics/delivery',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender phone number.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
          { name: 'storage', type: 'string', required: false, description: 'live or archive.' },
          { name: 'sourceType', type: 'string', required: false, description: 'PUBLIC_API, CAMPAIGN, CHATBOT, FLOW, or another source type.' },
          { name: 'status', type: 'string', required: false, description: 'Optional status filter.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/analytics/delivery?sourceType=CAMPAIGN" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Get delivery analytics',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "data": {
    "status": [
      { "status": "delivered", "count": 80 },
      { "status": "read", "count": 55 }
    ],
    "sourceType": [
      { "sourceType": "CAMPAIGN", "count": 100 }
    ]
  }
}`,
            label: 'Delivery analytics response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'reports-failure-analytics',
    title: 'Failure Analytics',
    slug: 'failure-analytics',
    description: 'Failure analytics grouped by error and template/source.',
    category: 'reports',
    icon: 'BarChart3',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Failure Analytics',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/analytics/failures. Failed message report grouped by error and template/source.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/analytics/failures',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender phone number.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
          { name: 'storage', type: 'string', required: false, description: 'live or archive.' },
          { name: 'templateName', type: 'string', required: false, description: 'Template name filter.' },
          { name: 'sourceType', type: 'string', required: false, description: 'Source type filter.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/analytics/failures?dateFrom=2026-06-01&dateTo=2026-06-05" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Get failure analytics',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "data": {
    "failures": [
      {
        "error": "Message undeliverable",
        "templateName": "payment_reminder",
        "sourceType": "CAMPAIGN",
        "count": 5
      }
    ]
  }
}`,
            label: 'Failure analytics response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'reports-template-analytics',
    title: 'Template Analytics',
    slug: 'template-analytics',
    description: 'Template-wise delivery, read, and failure counts.',
    category: 'reports',
    icon: 'BarChart3',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Template Analytics',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/analytics/templates. Template-wise delivery counts.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/analytics/templates',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender phone number.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
          { name: 'storage', type: 'string', required: false, description: 'live or archive.' },
          { name: 'templateName', type: 'string', required: false, description: 'Optional template name filter.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/analytics/templates?templateName=payment_reminder" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Get template analytics',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "data": {
    "templates": [
      {
        "templateName": "payment_reminder",
        "sent": 90,
        "delivered": 80,
        "read": 55,
        "failed": 5
      }
    ]
  }
}`,
            label: 'Template analytics response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'reports-date-analytics',
    title: 'Date Analytics',
    slug: 'date-analytics',
    description: 'Date-wise message counts and status counts.',
    category: 'reports',
    icon: 'BarChart3',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Date Analytics',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/analytics/dates. Date-wise message counts and status counts.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/analytics/dates',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender phone number.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
          { name: 'storage', type: 'string', required: false, description: 'live or archive.' },
          { name: 'sourceType', type: 'string', required: false, description: 'Source type filter.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/analytics/dates?dateFrom=2026-06-01&dateTo=2026-06-05" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Get date analytics',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "data": {
    "dates": [
      {
        "date": "2026-06-05",
        "total": 100,
        "statusCounts": {
          "sent": 90,
          "delivered": 80,
          "read": 55,
          "failed": 5
        }
      }
    ]
  }
}`,
            label: 'Date analytics response',
          },
        ],
      },
    ],
  },

  // =========================================================================
  // MESSAGE BILLING
  // =========================================================================
  {
    id: 'billing-user-history',
    title: 'User History',
    slug: 'user-history',
    description: 'Read user-wide message billing records across WhatsApp sender numbers.',
    category: 'message-billing',
    icon: 'CreditCard',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'User Billing History',
      },
      {
        type: 'paragraph',
        text: 'Public billing APIs are read-only JSON endpoints under the canonical billing base URL. Do not use /v2/billing; that twin path is intentionally not exposed for billing APIs.',
      },
      {
        type: 'code',
        language: 'text',
        code: 'https://graph.whats91.com/api/v2/billing',
        label: 'Billing base URL',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Authentication',
      },
      {
        type: 'paragraph',
        text: 'Use a public API token in the Authorization header. GET endpoints also accept authToken, auth_token, or token as query parameters.',
      },
      {
        type: 'code',
        language: 'http',
        code: 'Authorization: Bearer w91_live_xxxxxxxxxxxxxxxxx',
        label: 'Authorization header',
      },
      {
        type: 'heading',
        level: 2,
        text: 'User-wide Billing API',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/billing/messages. With a global token and no senderId, this returns billing records across the authenticated customer WhatsApp numbers.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/billing/messages',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'Optional WhatsApp sender phone number. If omitted with a global token, message billing is user-wide.' },
          { name: 'phoneNumberId', type: 'string', required: false, description: 'Optional Meta phone number id filter. Number-scoped tokens cannot use another number.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Positive integer. Default 50, max 200.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
          { name: 'status', type: 'string', required: false, description: 'accepted, sent, delivered, read, failed, pending, or another message billing status.' },
          { name: 'templateType', type: 'string', required: false, description: 'Meta pricing category: marketing, utility, authentication, or service.' },
          { name: 'billable', type: 'string', required: false, description: 'true, false, payable, or free.' },
          { name: 'pricingType', type: 'string', required: false, description: 'Meta pricing type, when available.' },
          { name: 'messageId', type: 'string', required: false, description: 'Exact Meta message id.' },
          { name: 'recipient', type: 'string', required: false, description: 'Recipient phone number.' },
          { name: 'conversationId', type: 'string', required: false, description: 'Meta conversation id.' },
          { name: 'sortBy', type: 'string', required: false, description: 'created_at, message_timestamp, pricing_category, status, or rate.' },
          { name: 'sortOrder', type: 'string', required: false, description: 'ASC or DESC.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/billing/messages?dateFrom=2026-06-01&limit=50" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'User-wide billing history',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
}`,
            label: 'Billing history response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Errors',
      },
      {
        type: 'table',
        headers: ['Error code', 'Meaning'],
        rows: [
          ['MISSING_AUTH_TOKEN', 'No token was supplied.'],
          ['INVALID_AUTH_TOKEN', 'Token is invalid, expired, revoked, or does not belong to an active customer.'],
          ['SENDER_NOT_ALLOWED', 'A number-scoped token tried to read another sender billing.'],
          ['VALIDATION_FAILED', 'Invalid date, pagination, template type, billable value, transaction type, or sort field.'],
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'billing-number-history',
    title: 'Number History',
    slug: 'number-history',
    description: 'Read message billing records for one WhatsApp registered number.',
    category: 'message-billing',
    icon: 'CreditCard',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Number-specific Billing History',
      },
      {
        type: 'paragraph',
        text: 'Use number-specific billing when reconciling costs for one WhatsApp registered number. Number-scoped tokens cannot use another number.',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/billing/messages?senderId=919999999999.',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/billing/messages/by-number/{phoneNumberId}.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/billing/messages/by-number/{phoneNumberId}',
        parameters: [
          { name: 'phoneNumberId', type: 'string', required: true, description: 'Meta phone number id for the sender being reconciled.' },
          { name: 'senderId', type: 'string', required: false, description: 'Alternative WhatsApp sender phone number filter through /billing/messages.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Positive integer. Default 50, max 200.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
          { name: 'billable', type: 'string', required: false, description: 'true, false, payable, or free.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/billing/messages/by-number/1234567890?limit=50" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Phone number billing history',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Billing records retrieved",
  "data": {
    "scope": "sender",
    "phoneNumberId": "1234567890",
    "senderId": "919999999999",
    "billingRecords": [],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 0,
      "hasMore": false
    }
  }
}`,
            label: 'Number billing response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'billing-template-type',
    title: 'Template Type',
    slug: 'template-type',
    description: 'Read billing records filtered by Meta pricing category.',
    category: 'message-billing',
    icon: 'CreditCard',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Template Type Billing History',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/billing/messages/by-template-type/{templateType}. templateType is the Meta pricing category, not the local template name.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/billing/messages/by-template-type/{templateType}',
        parameters: [
          { name: 'templateType', type: 'string', required: true, description: 'Meta pricing category: marketing, utility, authentication, or service.' },
          { name: 'senderId', type: 'string', required: false, description: 'Optional WhatsApp sender phone number.' },
          { name: 'phoneNumberId', type: 'string', required: false, description: 'Optional Meta phone number id filter.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
          { name: 'billable', type: 'string', required: false, description: 'true, false, payable, or free.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/billing/messages/by-template-type/utility?dateFrom=2026-06-01" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Utility billing history',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Billing records retrieved",
  "data": {
    "templateType": "utility",
    "billingRecords": [
      {
        "billingUid": "bill_uid",
        "templateType": "utility",
        "pricingCategory": "utility",
        "billingClass": "payable",
        "rate": 0.115
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1
    }
  }
}`,
            label: 'Template type billing response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'billing-delivered',
    title: 'Delivered',
    slug: 'delivered',
    description: 'List delivered billing records through the delivered convenience endpoint.',
    category: 'message-billing',
    icon: 'CreditCard',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Delivered Billing Records',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/billing/messages/delivered. This convenience endpoint returns delivered records. The same result can be requested with /billing/messages and status=delivered.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/billing/messages/delivered',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'Optional WhatsApp sender phone number.' },
          { name: 'phoneNumberId', type: 'string', required: false, description: 'Optional Meta phone number id filter.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Positive integer. Default 50, max 200.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/billing/messages/delivered?limit=50" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Delivered billing',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Billing records retrieved",
  "data": {
    "billingRecords": [
      {
        "status": "delivered",
        "billingClass": "payable",
        "messageId": "wamid.xxxxx"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50
    }
  }
}`,
            label: 'Delivered billing response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'billing-payable',
    title: 'Payable',
    slug: 'payable',
    description: 'List payable billing records through the payable convenience endpoint.',
    category: 'message-billing',
    icon: 'CreditCard',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Payable Billing Records',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/billing/messages/payable. This convenience endpoint returns payable records. The same result can be requested with /billing/messages and billable=payable.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/billing/messages/payable',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'Optional WhatsApp sender phone number.' },
          { name: 'templateType', type: 'string', required: false, description: 'Meta pricing category filter.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Positive integer. Default 50, max 200.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/billing/messages/payable?templateType=utility" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Payable billing',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Billing records retrieved",
  "data": {
    "billingRecords": [
      {
        "billingClass": "payable",
        "billable": true,
        "rate": 0.115
      }
    ],
    "summary": {
      "payableAmount": 92.5
    }
  }
}`,
            label: 'Payable billing response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'billing-free',
    title: 'Free',
    slug: 'free',
    description: 'List free billing records through the free convenience endpoint.',
    category: 'message-billing',
    icon: 'CreditCard',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Free Billing Records',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/billing/messages/free. This convenience endpoint returns free records. The same result can be requested with /billing/messages and billable=free.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/billing/messages/free',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'Optional WhatsApp sender phone number.' },
          { name: 'phoneNumberId', type: 'string', required: false, description: 'Optional Meta phone number id filter.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Positive integer. Default 50, max 200.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/billing/messages/free?dateFrom=2026-06-01" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Free billing',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Billing records retrieved",
  "data": {
    "billingRecords": [
      {
        "billingClass": "free",
        "billable": false,
        "rate": 0
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50
    }
  }
}`,
            label: 'Free billing response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'billing-summary',
    title: 'Summary',
    slug: 'summary',
    description: 'Read billing totals and category breakdowns.',
    category: 'message-billing',
    icon: 'CreditCard',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Billing Summary',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/billing/summary. Returns totals using the same filters as message billing history.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/billing/summary',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'Optional WhatsApp sender phone number.' },
          { name: 'phoneNumberId', type: 'string', required: false, description: 'Optional Meta phone number id filter.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
          { name: 'templateType', type: 'string', required: false, description: 'Meta pricing category filter.' },
          { name: 'billable', type: 'string', required: false, description: 'true, false, payable, or free.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/billing/summary?dateFrom=2026-06-01&dateTo=2026-06-30" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Billing summary',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
  }
}`,
            label: 'Billing summary response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'billing-wallet',
    title: 'Wallet',
    slug: 'wallet',
    description: 'Read current customer wallet balance for billing reconciliation.',
    category: 'message-billing',
    icon: 'CreditCard',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Wallet',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/billing/wallet. Use this endpoint to read the current wallet balance and billing account status exposed by Whats91.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/billing/wallet',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'Optional WhatsApp sender phone number when wallet context is sender scoped.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/billing/wallet" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Get wallet',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Wallet retrieved",
  "data": {
    "wallet": {
      "balance": 1250.75,
      "currency": "INR",
      "status": "ACTIVE"
    }
  }
}`,
            label: 'Wallet response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'billing-wallet-history',
    title: 'Wallet History',
    slug: 'wallet-history',
    description: 'Read wallet credit and debit transaction history.',
    category: 'message-billing',
    icon: 'CreditCard',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Wallet History',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/billing/wallet/history. Wallet history supports pagination, date filters, and transactionType=credit|debit.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/billing/wallet/history',
        parameters: [
          { name: 'page', type: 'number', required: false, description: 'Positive integer. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Positive integer. Default 50, max 200.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
          { name: 'transactionType', type: 'string', required: false, description: 'credit or debit.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/billing/wallet/history?transactionType=debit&limit=50" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Wallet transaction history',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Wallet history retrieved",
  "data": {
    "transactions": [
      {
        "transactionUid": "txn_uid",
        "transactionType": "debit",
        "amount": 0.115,
        "currency": "INR",
        "referenceType": "message_billing",
        "createdAt": "2026-06-05T08:00:02.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1,
      "hasMore": false
    }
  }
}`,
            label: 'Wallet history response',
          },
        ],
      },
    ],
  },

  // =========================================================================
  // CHATBOT
  // =========================================================================
  {
    id: 'chatbot-list',
    title: 'List Chatbots',
    slug: 'list',
    description: 'List Whats91 chatbot configurations for the resolved WhatsApp sender.',
    category: 'chatbot',
    icon: 'Bot',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'List Chatbots',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/chatbots. Use this endpoint to retrieve chatbot rules for the authenticated customer and resolved WhatsApp sender. The public v2 chatbot surface is available only through /api/v2/chatbots.',
      },
      {
        type: 'callout',
        variant: 'tip',
        text: 'Send Authorization: Bearer w91_public_token_here with every request. senderId is optional for sender-bound tokens; global tokens should pass the WhatsApp sender number.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/chatbots',
        parameters: [
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender number. Required for global tokens and optional for number-scoped tokens.' },
          { name: 'status', type: 'string', required: false, description: 'Filter by ACTIVE or INACTIVE chatbot status.' },
          { name: 'type', type: 'string', required: false, description: 'Filter by simple, media, or advanced chatbot type.' },
          { name: 'trigger', type: 'string', required: false, description: 'Text search inside trigger keywords or keyword.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer page number. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Page size for pagination. Default 50.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X GET "https://graph.whats91.com/api/v2/chatbots?senderId=916268662275&status=ACTIVE&page=1&limit=50" \\
  -H "Authorization: Bearer w91_public_token_here"`,
            label: 'List active chatbots',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
}`,
            label: 'List response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Filter Guide',
      },
      {
        type: 'table',
        headers: ['Filter', 'Accepted values', 'Use case'],
        rows: [
          ['status', 'ACTIVE, INACTIVE', 'Show production-ready chatbots or drafts separately.'],
          ['type', 'simple, media, advanced', 'Separate text, media, and interactive response rules.'],
          ['trigger', 'Any text search term', 'Find chatbot rules by keyword such as invoice, help, or catalog.'],
          ['page and limit', 'Positive integers', 'Paginate large chatbot rule sets.'],
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'chatbot-get',
    title: 'Get Chatbot',
    slug: 'get',
    description: 'Retrieve one chatbot by its public chatbot UID.',
    category: 'chatbot',
    icon: 'Bot',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Get Chatbot',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/chatbots/{chatbotUid}. chatbotUid is the public identifier returned after creation and must belong to the authenticated sender.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/chatbots/{chatbotUid}',
        parameters: [
          { name: 'chatbotUid', type: 'string', required: true, description: 'Public chatbot identifier returned by create or list responses.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender number for global tokens. Number-scoped tokens can only access their assigned sender.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X GET "https://graph.whats91.com/api/v2/chatbots/bot_invoice_help?senderId=916268662275" \\
  -H "Authorization: Bearer w91_public_token_here"`,
            label: 'Get one chatbot',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Chatbot retrieved",
  "data": {
    "senderId": "916268662275",
    "phoneNumberId": "1043189608869917",
    "wabaId": "1605386820498470",
    "chatbot": {
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
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Get response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Error Response',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "success": false,
  "error": {
    "code": "CHATBOT_NOT_FOUND",
    "message": "Chatbot UID does not belong to the authenticated sender."
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
        label: 'CHATBOT_NOT_FOUND',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'chatbot-create',
    title: 'Create Chatbot',
    slug: 'create',
    description: 'Create a chatbot with the generic public v2 endpoint by providing response.type.',
    category: 'chatbot',
    icon: 'Bot',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Create Chatbot',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: POST /api/v2/chatbots. This generic create API accepts the common chatbot fields and creates the response kind specified by response.type. Use the specialized text, media, and interactive routes when you want stronger shape-specific validation.',
      },
      {
        type: 'cards',
        cards: [
          { title: 'Text response', value: 'simple', description: 'Use response.type=text with response.text for plain message replies.', tone: 'green' },
          { title: 'Media response', value: 'media', description: 'Use response.type=media with a public HTTPS media URL.', tone: 'blue' },
          { title: 'Interactive response', value: 'advanced', description: 'Use response.type=buttons, cta, or list for structured WhatsApp replies.', tone: 'amber' },
          { title: 'No message send', value: 'config', description: 'Public v2 chatbot creation creates a bot configuration and never sends a WhatsApp message directly.', tone: 'slate' },
        ],
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/chatbots',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here.' },
          { name: 'Content-Type', type: 'header', required: true, description: 'Must be application/json for POST requests.' },
          { name: 'authToken', type: 'string', required: false, description: 'Compatibility body token. auth_token and token are also accepted.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender number. Required for global tokens and optional for sender-bound tokens.' },
          { name: 'chatbot.name', type: 'string', required: true, description: 'Human-readable chatbot name.' },
          { name: 'chatbot.trigger.type', type: 'string', required: false, description: 'contains, exact, starts_with, ends_with, contains_whole_word, regex, or welcome.' },
          { name: 'chatbot.trigger.keywords', type: 'string[]', required: false, description: 'Keyword list. Required unless trigger.keyword is supplied.' },
          { name: 'chatbot.trigger.keyword', type: 'string', required: false, description: 'Single keyword shortcut. Required unless trigger.keywords is supplied.' },
          { name: 'chatbot.priority', type: 'number', required: false, description: 'Optional priority clamped between 0 and 255.' },
          { name: 'chatbot.status', type: 'string', required: false, description: 'ACTIVE or INACTIVE. Omitted status defaults to ACTIVE.' },
          { name: 'chatbot.response.type', type: 'string', required: true, description: 'response.type decides whether the rule is text, media, buttons, cta, or list.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/chatbots" \\
  -H "Authorization: Bearer w91_public_token_here" \\
  -H "Content-Type: application/json" \\
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
  }'`,
            label: 'Generic create',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Chatbot created",
  "data": {
    "senderId": "916268662275",
    "phoneNumberId": "1043189608869917",
    "wabaId": "1605386820498470",
    "chatbot": {
      "chatbotUid": "bot_uid",
      "uid": "bot_uid",
      "name": "General Help",
      "botType": "simple",
      "triggerType": "contains",
      "replyTrigger": "help, support",
      "replyText": "How can we help you today?",
      "status": 1
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Create response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Common Fields',
      },
      {
        type: 'table',
        headers: ['Field', 'Required', 'Notes'],
        rows: [
          ['name', 'Yes', 'Required display name for the chatbot rule.'],
          ['trigger.keywords', 'Conditional', 'Array of trigger words. Required unless trigger.keyword is present.'],
          ['trigger.keyword', 'Conditional', 'Single trigger word. Required unless trigger.keywords is present.'],
          ['trigger.type', 'No', 'contains, exact, starts_with, ends_with, contains_whole_word, regex, or welcome.'],
          ['priority', 'No', 'Optional number clamped between 0 and 255.'],
          ['status', 'No', 'ACTIVE or INACTIVE. Defaults to ACTIVE.'],
          ['response.type', 'Yes', 'text, media, buttons, cta, or list.'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Validation Errors',
      },
      {
        type: 'table',
        headers: ['HTTP', 'Error code', 'Scenario'],
        rows: [
          ['401', 'MISSING_AUTH_TOKEN', 'No public API token supplied.'],
          ['401', 'INVALID_AUTH_TOKEN', 'Token is invalid, expired, revoked, or not tied to an active customer.'],
          ['403', 'SENDER_NOT_ALLOWED', 'Number-scoped token attempted another sender.'],
          ['403', 'FEATURE_NOT_AVAILABLE', 'Customer subscription does not include chatbots.'],
          ['400', 'MISSING_CHATBOT', 'Request body does not include chatbot.'],
          ['400', 'VALIDATION_FAILED', 'Missing name, trigger, response text, button labels, list rows, invalid status, or invalid CTA URL.'],
          ['400', 'WHATSAPP_SETUP_INCOMPLETE', 'Sender setup could not be resolved.'],
          ['415', 'UNSUPPORTED_CONTENT_TYPE', 'POST request is not JSON.'],
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'Store public API tokens server-side only. Do not place customer-specific secrets inside chatbot text, button labels, ctaUrl values, sections, or rows.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'chatbot-text',
    title: 'Text Chatbot',
    slug: 'text',
    description: 'Create simple keyword-triggered text chatbot responses.',
    category: 'chatbot',
    icon: 'Bot',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Text Chatbot',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: POST /api/v2/chatbots/text. Use this route for simple replies where the chatbot response only needs response.text.',
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/chatbots/text',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here.' },
          { name: 'Content-Type', type: 'header', required: true, description: 'application/json.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender number for global tokens.' },
          { name: 'chatbot.name', type: 'string', required: true, description: 'Name for the text chatbot.' },
          { name: 'chatbot.trigger', type: 'object', required: true, description: 'Trigger object with trigger.keyword or trigger.keywords.' },
          { name: 'chatbot.response.text', type: 'string', required: true, description: 'Text returned to the WhatsApp user.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/chatbots/text" \\
  -H "Authorization: Bearer w91_public_token_here" \\
  -H "Content-Type: application/json" \\
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
  }'`,
            label: 'Create text chatbot',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Chatbot created",
  "data": {
    "senderId": "916268662275",
    "chatbot": {
      "chatbotUid": "bot_uid",
      "name": "Invoice Help",
      "botType": "simple",
      "replyTrigger": "invoice, bill",
      "replyText": "Please share your invoice number.",
      "status": 1
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Text response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Practical Text Examples',
      },
      {
        type: 'table',
        headers: ['Example', 'Trigger', 'response.text'],
        rows: [
          ['Invoice Help', 'invoice, bill', 'Please share your invoice number.'],
          ['Order Tracking', 'track, order status', 'Share your order ID and we will check the latest status.'],
          ['Support Hours', 'hours, timing', 'Our support team is available Monday to Saturday, 10 AM to 7 PM.'],
          ['Lead Capture', 'pricing, demo', 'Please share your name and business email so our team can call you.'],
          ['Appointment Reminder', 'appointment, booking', 'Reply with your appointment ID to confirm or reschedule.'],
          ['Return Policy', 'return, refund', 'Returns are accepted within the configured policy window. Share your order ID to continue.'],
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        text: 'Text chatbots are best for deterministic replies, first-touch support triage, and short operational prompts.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'chatbot-media',
    title: 'Media Chatbot',
    slug: 'media',
    description: 'Create chatbot replies that include public HTTPS media assets.',
    category: 'chatbot',
    icon: 'Bot',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Media Chatbot',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: POST /api/v2/chatbots/media. Media chatbots support IMAGE, VIDEO, AUDIO, and DOCUMENT. The media URL must be public HTTPS so Whats91 and Meta can fetch it when the chatbot replies.',
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/chatbots/media',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here.' },
          { name: 'Content-Type', type: 'header', required: true, description: 'application/json.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender number for global tokens.' },
          { name: 'chatbot.name', type: 'string', required: true, description: 'Name for the media chatbot.' },
          { name: 'chatbot.trigger', type: 'object', required: true, description: 'Trigger object with trigger.keyword or trigger.keywords.' },
          { name: 'chatbot.response.text', type: 'string', required: false, description: 'Optional caption or intro text.' },
          { name: 'chatbot.response.media.type', type: 'string', required: true, description: 'IMAGE, VIDEO, AUDIO, or DOCUMENT.' },
          { name: 'chatbot.response.media.url', type: 'string', required: true, description: 'Public HTTPS URL for the media asset.' },
          { name: 'chatbot.response.media.fileName', type: 'string', required: false, description: 'Recommended for DOCUMENT responses.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/chatbots/media" \\
  -H "Authorization: Bearer w91_public_token_here" \\
  -H "Content-Type: application/json" \\
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
  }'`,
            label: 'Create media chatbot',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Chatbot created",
  "data": {
    "senderId": "916268662275",
    "chatbot": {
      "chatbotUid": "bot_catalog_pdf",
      "name": "Catalog PDF",
      "botType": "media",
      "replyTrigger": "catalog",
      "replyText": "Here is our latest catalog.",
      "media": {
        "type": "DOCUMENT",
        "url": "https://cdn.example.com/catalog.pdf",
        "fileName": "catalog.pdf"
      },
      "status": 1
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Media response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Supported Media',
      },
      {
        type: 'table',
        headers: ['Media type', 'Common use case', 'Notes'],
        rows: [
          ['IMAGE', 'Product photo, offer banner, ticket QR image', 'Use a public HTTPS image URL.'],
          ['VIDEO', 'Product demo, onboarding walkthrough', 'Use a public HTTPS video URL that Meta can fetch.'],
          ['AUDIO', 'Voice note, recorded instructions', 'Use a public HTTPS audio URL.'],
          ['DOCUMENT', 'Catalog, invoice, policy PDF', 'Include fileName for a clearer WhatsApp document attachment.'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Rejected Media Inputs',
      },
      {
        type: 'list',
        items: [
          'http:// URLs are rejected because media must use public HTTPS.',
          'localhost, private IP, and .local URLs are rejected because Meta cannot fetch them.',
          'metaMediaId, mediaId, or other pre-uploaded Meta media references are rejected.',
          'base64 strings, file paths, multipart upload fields, and direct uploads are rejected.',
          'Missing media returns MISSING_CHATBOT_MEDIA; invalid media URL or type returns INVALID_CHATBOT_MEDIA.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Practical Media Examples',
      },
      {
        type: 'table',
        headers: ['Example', 'Media type', 'Trigger', 'Response pattern'],
        rows: [
          ['Catalog PDF', 'DOCUMENT', 'catalog', 'Send a current product catalog PDF.'],
          ['Product Image', 'IMAGE', 'photo, image', 'Send a product image with a short caption.'],
          ['Demo Video', 'VIDEO', 'demo, walkthrough', 'Send a public demo video link as the reply media.'],
          ['Audio Guide', 'AUDIO', 'audio help', 'Send recorded setup instructions.'],
          ['Invoice Attachment', 'DOCUMENT', 'invoice copy', 'Send a generated invoice PDF URL.'],
          ['Warranty Document', 'DOCUMENT', 'warranty', 'Send policy terms with fileName warranty.pdf.'],
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'chatbot-interactive',
    title: 'Interactive Chatbot',
    slug: 'interactive',
    description: 'Create advanced chatbot replies with buttons, CTA links, and WhatsApp list menus.',
    category: 'chatbot',
    icon: 'Bot',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Interactive Chatbot',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: POST /api/v2/chatbots/interactive. Use this route for WhatsApp interactive response types: buttons, cta, and list.',
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'Buttons are limited to three choices, matching WhatsApp interactive button limits. CTA URLs must use HTTPS.',
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/chatbots/interactive',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here.' },
          { name: 'Content-Type', type: 'header', required: true, description: 'application/json.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender number for global tokens.' },
          { name: 'chatbot.name', type: 'string', required: true, description: 'Name for the interactive chatbot.' },
          { name: 'chatbot.trigger', type: 'object', required: true, description: 'Trigger object with trigger.keyword or trigger.keywords.' },
          { name: 'chatbot.response.type', type: 'string', required: true, description: 'buttons, cta, or list.' },
          { name: 'chatbot.response.text', type: 'string', required: true, description: 'Main message body shown to the user.' },
          { name: 'chatbot.response.footerText', type: 'string', required: false, description: 'Optional footer text for buttons and list responses.' },
          { name: 'chatbot.response.buttons', type: 'array', required: false, description: 'Button rows for response.type=buttons. Each item needs id and label.' },
          { name: 'chatbot.response.ctaText', type: 'string', required: false, description: 'Button label for response.type=cta.' },
          { name: 'chatbot.response.ctaUrl', type: 'string', required: false, description: 'HTTPS destination URL for response.type=cta.' },
          { name: 'chatbot.response.sections', type: 'array', required: false, description: 'List sections for response.type=list. Each section contains rows.' },
          { name: 'chatbot.response.rows', type: 'array', required: false, description: 'Rows inside a list section. Each row needs id and title.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/chatbots/interactive" \\
  -H "Authorization: Bearer w91_public_token_here" \\
  -H "Content-Type: application/json" \\
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
  }'`,
            label: 'Create button chatbot',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Chatbot created",
  "data": {
    "senderId": "916268662275",
    "chatbot": {
      "chatbotUid": "bot_support_choices",
      "name": "Support Choices",
      "botType": "advanced",
      "replyTrigger": "help",
      "replyText": "How can we help?",
      "status": 1
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Interactive response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'CTA Example',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
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
}`,
        label: 'Open Portal CTA body',
      },
      {
        type: 'heading',
        level: 2,
        text: 'List Example',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
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
}`,
        label: 'Department Menu list body',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Practical Interactive Examples',
      },
      {
        type: 'table',
        headers: ['Example', 'response.type', 'Trigger', 'Use case'],
        rows: [
          ['Support Choices', 'buttons', 'help', 'Route users to Sales or Support quickly.'],
          ['Open Portal', 'cta', 'portal', 'Send a single HTTPS portal link using ctaUrl.'],
          ['Department Menu', 'list', 'menu', 'Show department sections and rows for routing.'],
          ['Product Picker', 'list', 'products', 'Let users choose product categories from rows.'],
          ['Payment Link', 'cta', 'pay', 'Open a secure hosted payment URL.'],
          ['Store Locator', 'buttons', 'store', 'Offer city or region choices with three or fewer buttons.'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Validation Notes',
      },
      {
        type: 'list',
        items: [
          'For buttons, every button requires id and label, and there can be no more than three buttons.',
          'For cta, ctaText and ctaUrl are required, and ctaUrl must be HTTPS.',
          'For list, sections must include rows, and each row must include id and title.',
          'Invalid button labels, missing list rows, or invalid CTA URLs return VALIDATION_FAILED.',
        ],
      },
    ],
  },

  // =========================================================================
  // CONTACT BOOK
  // =========================================================================
  {
    id: 'contact-book-list',
    title: 'List Books',
    slug: 'list',
    description: 'List account-wide Whats91 contact books with pagination and filters.',
    category: 'contact-book',
    icon: 'BookUser',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'List Contact Books',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/contact-books. Whats91 exposes public contact book management through /api/v2/contact-books only. Contact books are customer-account-wide resources and require a global public API token.',
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'Number-scoped public API tokens cannot access contact books. They return TOKEN_SCOPE_NOT_ALLOWED because contact books are not tied to one WhatsApp sender number.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/contact-books',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here. Must be a global public API token.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer page number. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Page size for pagination. Default 50.' },
          { name: 'status', type: 'string', required: false, description: 'Filter by ACTIVE or INACTIVE contact book status.' },
          { name: 'search', type: 'string', required: false, description: 'Search by contact book name or description.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X GET "https://graph.whats91.com/api/v2/contact-books?page=1&limit=50&status=ACTIVE&search=retail" \\
  -H "Authorization: Bearer w91_public_token_here"`,
            label: 'List contact books',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
}`,
            label: 'List response',
          },
        ],
      },
      {
        type: 'paragraph',
        text: 'items is an alias of contactBooks for generic paginated clients. List endpoints return empty arrays when no rows match.',
      },
      {
        type: 'table',
        headers: ['Filter', 'Accepted values', 'Use case'],
        rows: [
          ['page and limit', 'Positive integers', 'Move through paginated contact book results.'],
          ['status', 'ACTIVE, INACTIVE', 'Separate active lists from archived or disabled books.'],
          ['search', 'Any search string', 'Find books such as Retail Leads, VIP Buyers, or Trial Users.'],
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'contact-book-get',
    title: 'Get Book',
    slug: 'get',
    description: 'Retrieve one contact book by UID.',
    category: 'contact-book',
    icon: 'BookUser',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Get Contact Book',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/contact-books/{bookUid}. Use this endpoint when a client needs metadata for one contact book before uploading contacts or building a campaign audience.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/contact-books/{bookUid}',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here. Must be a global public API token.' },
          { name: 'bookUid', type: 'string', required: true, description: 'Contact book UID, for example grp_abc.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X GET "https://graph.whats91.com/api/v2/contact-books/grp_abc" \\
  -H "Authorization: Bearer w91_public_token_here"`,
            label: 'Get contact book',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Contact book retrieved",
  "data": {
    "contactBook": {
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
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Get response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Not Found',
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "success": false,
  "error": {
    "code": "CONTACT_BOOK_NOT_FOUND",
    "message": "Contact book UID does not belong to the authenticated customer."
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
        label: 'CONTACT_BOOK_NOT_FOUND',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'contact-book-contacts',
    title: 'Get Contacts',
    slug: 'contacts',
    description: 'List contacts in one contact book with pagination and search.',
    category: 'contact-book',
    icon: 'BookUser',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Get Contacts',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/contact-books/{bookUid}/contacts. Use this API to inspect the contacts linked to a specific contact book.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/contact-books/{bookUid}/contacts',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here. Must be a global public API token.' },
          { name: 'bookUid', type: 'string', required: true, description: 'Contact book UID, for example grp_abc.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer page number. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Page size for pagination. Default 50.' },
          { name: 'search', type: 'string', required: false, description: 'Search by phone, display name, email, or company details.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X GET "https://graph.whats91.com/api/v2/contact-books/grp_abc/contacts?page=1&limit=50&search=asha" \\
  -H "Authorization: Bearer w91_public_token_here"`,
            label: 'List contacts in a book',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
        "groups": [{ "uid": "grp_abc", "name": "Retail Leads", "status": "ACTIVE" }],
        "customFields": { "city": "Mumbai" }
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
  }
}`,
            label: 'Contacts response',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Internal database IDs, user_id, and admin_id are never returned by public v2 contact book APIs.',
      },
      {
        type: 'table',
        headers: ['Field', 'Meaning'],
        rows: [
          ['phoneE164', 'Normalized WhatsApp-ready phone number.'],
          ['displayName', 'Readable contact name for dashboards and campaign previews.'],
          ['email and companyName', 'Optional enrichment fields stored with the contact.'],
          ['groups', 'Contact book memberships returned as public UIDs and names.'],
          ['customFields', 'Developer-defined key-value metadata such as city, source, or segment.'],
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'contact-book-create',
    title: 'Create Book',
    slug: 'create',
    description: 'Create a new account-wide contact book.',
    category: 'contact-book',
    icon: 'BookUser',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Create Contact Book',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: POST /api/v2/contact-books. Create a contact book before linking contacts through the bulk upload endpoint. The contact book is created with ACTIVE status.',
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/contact-books',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here. Must be a global public API token.' },
          { name: 'Content-Type', type: 'header', required: true, description: 'Content-Type: application/json.' },
          { name: 'authToken', type: 'string', required: false, description: 'Compatibility body token. auth_token and token are also accepted.' },
          { name: 'name', type: 'string', required: true, description: 'Contact book name.' },
          { name: 'description', type: 'string', required: false, description: 'Short explanation of the book purpose.' },
          { name: 'color', type: 'string', required: false, description: 'Hex color used for dashboard grouping, for example #0f62fe.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/contact-books" \\
  -H "Authorization: Bearer w91_public_token_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Retail Leads",
    "description": "Retail campaign contacts",
    "color": "#0f62fe"
  }'`,
            label: 'Create contact book',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Contact book created",
  "data": {
    "contactBook": {
      "contactBookUid": "grp_abc",
      "uid": "grp_abc",
      "name": "Retail Leads",
      "description": "Retail campaign contacts",
      "color": "#0f62fe",
      "status": "ACTIVE",
      "contactCount": 0
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Create response',
          },
        ],
      },
      {
        type: 'cards',
        cards: [
          { title: 'Retail Leads', value: 'ACTIVE', description: 'Use for contacts collected from retail campaigns or landing pages.', tone: 'green' },
          { title: 'VIP Customers', value: 'ACTIVE', description: 'Use for high-value customers and priority broadcasts.', tone: 'blue' },
          { title: 'Trial Users', value: 'ACTIVE', description: 'Use for onboarding journeys and product education campaigns.', tone: 'amber' },
          { title: 'Event Attendees', value: 'ACTIVE', description: 'Use for event follow-up, reminders, and feedback collection.', tone: 'slate' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'contact-book-update',
    title: 'Update Book',
    slug: 'update',
    description: 'Update a contact book name through public v2.',
    category: 'contact-book',
    icon: 'BookUser',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Update Contact Book',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: POST /api/v2/contact-books/{bookUid}. Only name is editable through public v2 in this phase.',
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/contact-books/{bookUid}',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here. Must be a global public API token.' },
          { name: 'Content-Type', type: 'header', required: true, description: 'Content-Type: application/json.' },
          { name: 'bookUid', type: 'string', required: true, description: 'Contact book UID, for example grp_abc.' },
          { name: 'name', type: 'string', required: true, description: 'Replacement contact book name.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/contact-books/grp_abc" \\
  -H "Authorization: Bearer w91_public_token_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Retail Leads Updated"
  }'`,
            label: 'Update contact book',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Contact book updated",
  "data": {
    "contactBook": {
      "contactBookUid": "grp_abc",
      "uid": "grp_abc",
      "name": "Retail Leads Updated",
      "description": "Retail campaign contacts",
      "color": "#0f62fe",
      "status": "ACTIVE",
      "contactCount": 120
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Update response',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Use dashboard tools for fields outside the public v2 update contract. Public API update currently changes the contact book name only.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'contact-book-upload',
    title: 'Upload Contacts',
    slug: 'upload',
    description: 'Bulk upload contacts into one contact book using a JSON payload.',
    category: 'contact-book',
    icon: 'BookUser',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Upload Contacts',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: POST /api/v2/contact-books/{bookUid}/contacts/bulk. Bulk upload is JSON-only. CSV/XLSX multipart upload remains dashboard-only for now.',
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/contact-books/{bookUid}/contacts/bulk',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here. Must be a global public API token.' },
          { name: 'Content-Type', type: 'header', required: true, description: 'Content-Type: application/json.' },
          { name: 'bookUid', type: 'string', required: true, description: 'Contact book UID, for example grp_abc.' },
          { name: 'defaultCountryCode', type: 'string', required: false, description: 'Country code used to normalize local phone numbers, for example 91.' },
          { name: 'contacts', type: 'array', required: true, description: 'Array of contact objects. Maximum 1000 contacts per request.' },
          { name: 'contacts[].phone', type: 'string', required: true, description: 'Contact phone number. It is normalized using defaultCountryCode.' },
          { name: 'contacts[].displayName', type: 'string', required: false, description: 'Readable contact name.' },
          { name: 'contacts[].firstName', type: 'string', required: false, description: 'Optional first name.' },
          { name: 'contacts[].lastName', type: 'string', required: false, description: 'Optional last name.' },
          { name: 'contacts[].email', type: 'string', required: false, description: 'Optional email address.' },
          { name: 'contacts[].companyName', type: 'string', required: false, description: 'Optional company name.' },
          { name: 'contacts[].customFields', type: 'object', required: false, description: 'Optional developer-defined metadata.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/contact-books/grp_abc/contacts/bulk" \\
  -H "Authorization: Bearer w91_public_token_here" \\
  -H "Content-Type: application/json" \\
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
  }'`,
            label: 'Bulk upload contacts',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
        "contact": { "contactUid": "ct_existing", "phone": "917000782082" }
      },
      {
        "row": 2,
        "status": "CREATED",
        "contact": { "contactUid": "ct_new", "phone": "917999999999" }
      },
      {
        "row": 3,
        "status": "SKIPPED",
        "reason": "DUPLICATE_IN_REQUEST",
        "phone": "917999999999"
      }
    ]
  }
}`,
            label: 'Upload response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Bulk Upload Behavior',
      },
      {
        type: 'list',
        items: [
          'Maximum 1000 contacts per request.',
          'Phone numbers are normalized using defaultCountryCode.',
          'Existing contacts are updated and linked to the contact book.',
          'New contacts are created and linked to the contact book.',
          'Duplicate numbers inside the same request are skipped with DUPLICATE_IN_REQUEST.',
          'Invalid rows do not fail the whole request; they are returned in row-level results.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Validation Errors',
      },
      {
        type: 'table',
        headers: ['HTTP', 'Error code', 'Scenario'],
        rows: [
          ['401', 'MISSING_AUTH_TOKEN', 'No public API token supplied.'],
          ['401', 'INVALID_AUTH_TOKEN', 'Token is invalid, expired, revoked, or user inactive.'],
          ['403', 'TOKEN_SCOPE_NOT_ALLOWED', 'Token is number-scoped; contact books require a global token.'],
          ['403', 'FEATURE_NOT_AVAILABLE', 'Customer subscription does not include contacts.'],
          ['400', 'VALIDATION_FAILED', 'Invalid pagination, missing or long name, invalid contacts payload, too many contacts, or invalid custom fields.'],
          ['404', 'CONTACT_BOOK_NOT_FOUND', 'Contact book UID does not belong to the authenticated customer.'],
          ['415', 'UNSUPPORTED_CONTENT_TYPE', 'POST request is not JSON.'],
        ],
      },
    ],
  },

  // =========================================================================
  // BLACKLIST
  // =========================================================================
  {
    id: 'blacklist-list',
    title: 'List Entries',
    slug: 'list',
    description: 'List sender-scoped message blacklist entries for a WhatsApp registered sender.',
    category: 'blacklist',
    icon: 'Ban',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'List Blacklist Entries',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/message-blacklist. Whats91 exposes sender-scoped blacklist management through /api/v2/message-blacklist only. If a recipient is active in the blacklist for that sender, Whats91 send paths block delivery before Meta is called.',
      },
      {
        type: 'callout',
        variant: 'tip',
        text: 'Use Authorization: Bearer w91_public_token_here. For GET compatibility, authToken, auth_token, or token can also be sent in the query string.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/message-blacklist',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp registered sender number. Global tokens can pass any owned sender; number-scoped tokens can only manage their bound sender.' },
          { name: 'status', type: 'string', required: false, description: 'ACTIVE, INACTIVE, or ALL. Default is ACTIVE.' },
          { name: 'search', type: 'string', required: false, description: 'Matches normalized phone, display phone, or reason.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer page number. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Page size for pagination. Default 50.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X GET "https://graph.whats91.com/api/v2/message-blacklist?senderId=916268662275&page=1&limit=50&status=ACTIVE" \\
  -H "Authorization: Bearer w91_public_token_here"`,
            label: 'List blacklist entries',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
}`,
            label: 'List response',
          },
        ],
      },
      {
        type: 'paragraph',
        text: 'items is an alias for generic paginated clients. Internal database IDs, user_id, admin_id, encrypted values, and Redis/cache details are never returned.',
      },
      {
        type: 'table',
        headers: ['Filter', 'Accepted values', 'Use case'],
        rows: [
          ['senderId', 'WhatsApp registered sender number', 'Resolve the sender whose blacklist should be inspected.'],
          ['status', 'ACTIVE, INACTIVE, ALL', 'Review currently blocked numbers, inactive rows, or the complete list.'],
          ['search', 'Phone or reason text', 'Find entries by normalized phone, display phone, or opt-out reason.'],
          ['page and limit', 'Positive integers', 'Paginate sender-scoped blacklist entries.'],
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'blacklist-get',
    title: 'Get Entry',
    slug: 'get',
    description: 'Retrieve one sender-scoped blacklist entry by UID.',
    category: 'blacklist',
    icon: 'Ban',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Get Blacklist Entry',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/message-blacklist/{blacklistUid}. The response includes data.blacklistEntry for the resolved sender.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/message-blacklist/{blacklistUid}',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here.' },
          { name: 'blacklistUid', type: 'string', required: true, description: 'Public blacklist entry UID, for example bl_abc.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp registered sender number. Required when the token is not bound to one sender.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X GET "https://graph.whats91.com/api/v2/message-blacklist/bl_abc?senderId=916268662275" \\
  -H "Authorization: Bearer w91_public_token_here"`,
            label: 'Get blacklist entry',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Blacklist entry retrieved",
  "data": {
    "blacklistEntry": {
      "blacklistUid": "bl_abc",
      "uid": "bl_abc",
      "senderPhoneNumber": "916268662275",
      "normalizedPhone": "919876543210",
      "displayPhone": "9876543210",
      "source": "MANUAL",
      "reason": "Customer requested opt-out",
      "status": "ACTIVE",
      "deactivatedAt": null
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Get response',
          },
        ],
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "success": false,
  "message": "Blacklist entry not found",
  "error_code": "BLACKLIST_ENTRY_NOT_FOUND",
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
        label: 'Not found response',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'blacklist-add',
    title: 'Add Number',
    slug: 'add',
    description: 'Add or reactivate a recipient phone number in the sender blacklist.',
    category: 'blacklist',
    icon: 'Ban',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Add Number',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: POST /api/v2/message-blacklist. Add or reactivate a blacklisted phone number for the resolved sender.',
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/message-blacklist',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here.' },
          { name: 'Content-Type', type: 'header', required: true, description: 'Content-Type: application/json.' },
          { name: 'authToken', type: 'string', required: false, description: 'Compatibility body token. auth_token and token are also accepted.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp registered sender number.' },
          { name: 'phone', type: 'string', required: true, description: 'Recipient phone number to blacklist.' },
          { name: 'reason', type: 'string', required: false, description: 'Operational reason such as Customer requested opt-out.' },
          { name: 'source', type: 'string', required: false, description: 'Source label such as MANUAL.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/message-blacklist" \\
  -H "Authorization: Bearer w91_public_token_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "senderId": "916268662275",
    "phone": "98765 43210",
    "reason": "Customer requested opt-out",
    "source": "MANUAL"
  }'`,
            label: 'Add number',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
}`,
            label: 'Add response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Behavior',
      },
      {
        type: 'list',
        items: [
          'Phone numbers are normalized using the same contact-book phone rules.',
          'Duplicate active rows for the same customer, sender, and normalized phone are not created.',
          'Re-adding an inactive number reactivates it.',
          'Redis blacklist cache for that customer is invalidated after the write.',
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'blacklist-update',
    title: 'Update Entry',
    slug: 'update',
    description: 'Update the reason or status for one sender-scoped blacklist entry.',
    category: 'blacklist',
    icon: 'Ban',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Update Entry',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: POST /api/v2/message-blacklist/{blacklistUid}. Only reason and status are editable through public v2. Supported status values are ACTIVE and INACTIVE.',
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/message-blacklist/{blacklistUid}',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here.' },
          { name: 'Content-Type', type: 'header', required: true, description: 'Content-Type: application/json.' },
          { name: 'blacklistUid', type: 'string', required: true, description: 'Public blacklist entry UID, for example bl_abc.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp registered sender number.' },
          { name: 'reason', type: 'string', required: false, description: 'Replacement opt-out reason.' },
          { name: 'status', type: 'string', required: false, description: 'ACTIVE or INACTIVE.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/message-blacklist/bl_abc" \\
  -H "Authorization: Bearer w91_public_token_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "senderId": "916268662275",
    "reason": "Updated opt-out reason",
    "status": "INACTIVE"
  }'`,
            label: 'Update entry',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Blacklist entry updated",
  "data": {
    "blacklistEntry": {
      "blacklistUid": "bl_abc",
      "reason": "Updated opt-out reason",
      "status": "INACTIVE",
      "deactivatedAt": "2026-06-06T09:10:00.000Z"
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Update response',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Send at least one editable field. Empty update payloads return VALIDATION_FAILED.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'blacklist-delete',
    title: 'Delete Entry',
    slug: 'delete',
    description: 'Soft-remove an active blacklist entry for a sender.',
    category: 'blacklist',
    icon: 'Ban',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Delete Entry',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: DELETE /api/v2/message-blacklist/{blacklistUid}. Delete is a soft removal. The row is marked INACTIVE, deactivatedAt is set, and future sends are no longer blocked for that recipient unless it is reactivated.',
      },
      {
        type: 'api',
        method: 'DELETE',
        endpoint: '/api/v2/message-blacklist/{blacklistUid}',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here.' },
          { name: 'blacklistUid', type: 'string', required: true, description: 'Public blacklist entry UID, for example bl_abc.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp registered sender number.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl -X DELETE "https://graph.whats91.com/api/v2/message-blacklist/bl_abc?senderId=916268662275" \\
  -H "Authorization: Bearer w91_public_token_here"`,
            label: 'Delete entry',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
}`,
            label: 'Delete response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Error Responses',
      },
      {
        type: 'table',
        headers: ['HTTP', 'Error code', 'Meaning'],
        rows: [
          ['401', 'MISSING_AUTH_TOKEN', 'No public token was supplied.'],
          ['401', 'INVALID_AUTH_TOKEN', 'Token is invalid, expired, revoked, or not tied to an active customer.'],
          ['403', 'SENDER_NOT_ALLOWED', 'Number-scoped token requested another sender.'],
          ['403', 'FEATURE_NOT_AVAILABLE', 'The customer does not have the contacts feature.'],
          ['400', 'WHATSAPP_SETUP_INCOMPLETE', 'Sender context could not resolve a usable WhatsApp number.'],
          ['400', 'VALIDATION_FAILED', 'Invalid phone, status, pagination, or empty update payload.'],
          ['404', 'BLACKLIST_ENTRY_NOT_FOUND', 'The UID does not belong to the authenticated sender.'],
          ['415', 'UNSUPPORTED_CONTENT_TYPE', 'POST body is not JSON.'],
        ],
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "success": false,
  "message": "status must be ACTIVE, INACTIVE, or ALL",
  "error_code": "VALIDATION_FAILED",
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
        label: 'Validation error example',
      },
    ],
  },

  // =========================================================================
  // CONVERSATIONS
  // =========================================================================
  {
    id: 'conversations-list',
    title: 'List Conversations',
    slug: 'list',
    description: 'List conversation report records for the resolved WhatsApp sender.',
    category: 'conversations',
    icon: 'MessageCircle',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'List Conversations',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/conversations. Conversation report APIs are read-only JSON endpoints under https://graph.whats91.com/api/v2/reports/conversations. Do not use /v2/reports/conversations; that twin path is intentionally not exposed for reporting APIs.',
      },
      {
        type: 'callout',
        variant: 'tip',
        text: 'Use Authorization: Bearer w91_live_xxxxxxxxxxxxxxxxx. GET endpoints also accept authToken, auth_token, or token as query parameters for compatibility.',
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Conversation data is always scoped to the authenticated customer. Public APIs do not accept a userId filter.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/conversations',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_live_xxxxxxxxxxxxxxxxx.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender phone number. Optional when token scope/default sender resolves it.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Positive integer. Default 50, max 200.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD. Applies to conversation activity time.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD. Applies to conversation activity time.' },
          { name: 'search', type: 'string', required: false, description: 'Matches contact name, phone, or last message.' },
          { name: 'status', type: 'string', required: false, description: 'active, closed, blocked, or all.' },
          { name: 'archived', type: 'boolean', required: false, description: 'true or false.' },
          { name: 'unreadOnly', type: 'boolean', required: false, description: 'true or false.' },
          { name: 'mobileNumber', type: 'string', required: false, description: 'Recipient phone filter.' },
          { name: 'contactPhone', type: 'string', required: false, description: 'Recipient phone filter alias.' },
          { name: 'lastDirection', type: 'string', required: false, description: 'inbound or outbound.' },
          { name: 'labelUid', type: 'string', required: false, description: 'Filter conversations with an assigned label.' },
          { name: 'includeLabelUids', type: 'string', required: false, description: 'Comma-separated labels to include.' },
          { name: 'excludeLabelUids', type: 'string', required: false, description: 'Comma-separated labels to exclude.' },
          { name: 'labelMatchMode', type: 'string', required: false, description: 'ANY or ALL. Default ANY.' },
          { name: 'sortBy', type: 'string', required: false, description: 'last_message_at, updated_at, created_at, total_messages, or unread_count.' },
          { name: 'sortOrder', type: 'string', required: false, description: 'ASC or DESC.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/conversations?senderId=919999999999&unreadOnly=true&page=1&limit=50" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'List unread conversations',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
          { "uid": "lbl_support", "labelName": "Support" }
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
}`,
            label: 'List response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Common Filters',
      },
      {
        type: 'table',
        headers: ['Filter', 'Accepted values', 'Notes'],
        rows: [
          ['status', 'active, closed, blocked, all', 'Conversation status filter.'],
          ['archived and unreadOnly', 'true or false', 'Limit to archived or unread conversations.'],
          ['lastDirection', 'inbound, outbound', 'Filter by last message direction.'],
          ['labelUid, includeLabelUids, excludeLabelUids', 'Label UIDs', 'Comma-separated values are accepted for include/exclude filters.'],
          ['labelMatchMode', 'ANY, ALL', 'Default ANY.'],
          ['sortBy', 'last_message_at, updated_at, created_at, total_messages, unread_count', 'Conversation list sort field.'],
          ['sortOrder', 'ASC, DESC', 'Sort direction.'],
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'conversations-summary',
    title: 'Summary',
    slug: 'summary',
    description: 'Return aggregate conversation totals for the same conversation filters.',
    category: 'conversations',
    icon: 'MessageCircle',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Conversation Summary',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/conversations/summary. This endpoint returns totals for the same conversation filters used by the list endpoint, including senderId, dateFrom, dateTo, search, status, archived, unreadOnly, lastDirection, label filters, and labelMatchMode.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/conversations/summary',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_live_xxxxxxxxxxxxxxxxx.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender phone number.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
          { name: 'status', type: 'string', required: false, description: 'active, closed, blocked, or all.' },
          { name: 'archived', type: 'boolean', required: false, description: 'true or false.' },
          { name: 'unreadOnly', type: 'boolean', required: false, description: 'true or false.' },
          { name: 'lastDirection', type: 'string', required: false, description: 'inbound or outbound.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/conversations/summary?senderId=919999999999&dateFrom=2026-06-01&dateTo=2026-06-05" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Conversation summary',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
}`,
            label: 'Summary response',
          },
        ],
      },
      {
        type: 'cards',
        cards: [
          { title: 'Unread conversations', value: 'unreadConversations', description: 'Conversations that still need attention from the team.', tone: 'amber' },
          { title: 'Active conversations', value: 'activeConversations', description: 'Open conversation records in the selected date/filter range.', tone: 'green' },
          { title: 'Direction split', value: 'inbound/outbound', description: 'inboundLastCount and outboundLastCount show who sent the latest message.', tone: 'blue' },
          { title: 'Archive volume', value: 'archivedConversations', description: 'Archived conversations matching the same conversation filters.', tone: 'slate' },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'conversations-by-mobile',
    title: 'By Mobile',
    slug: 'by-mobile',
    description: 'List conversation thread summaries for one recipient mobile number.',
    category: 'conversations',
    icon: 'MessageCircle',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Conversations By Mobile',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/conversations/by-mobile/{mobileNumber}. This returns conversation thread summaries for one recipient phone, scoped to the authenticated sender.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/conversations/by-mobile/{mobileNumber}',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_live_xxxxxxxxxxxxxxxxx.' },
          { name: 'mobileNumber', type: 'string', required: true, description: 'Recipient phone number to inspect.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender phone number.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Positive integer. Default 50, max 200.' },
          { name: 'dateFrom', type: 'string', required: false, description: 'YYYY-MM-DD start date.' },
          { name: 'dateTo', type: 'string', required: false, description: 'YYYY-MM-DD end date.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/conversations/by-mobile/919343841961?senderId=919999999999" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Conversations by mobile',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Mobile conversation reports retrieved",
  "data": {
    "mobileNumber": "919343841961",
    "senderId": "919999999999",
    "conversations": [
      {
        "conversationId": 194977,
        "contactPhone": "919343841961",
        "contactName": "Prashant Tayal",
        "lastMessageContent": "hi",
        "lastMessageAt": "2026-06-05T06:08:48.000Z",
        "status": "active",
        "unreadCount": 1,
        "totalMessages": 2
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "count": 1,
      "hasMore": false
    }
  }
}`,
            label: 'By mobile response',
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'conversations-get',
    title: 'Get Conversation',
    slug: 'get',
    description: 'Retrieve one conversation by numeric conversation id.',
    category: 'conversations',
    icon: 'MessageCircle',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Get Conversation',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/conversations/{conversationId}. conversationId is the existing numeric conversation id. It is checked against the authenticated customer and sender before any data is returned.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/conversations/{conversationId}',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_live_xxxxxxxxxxxxxxxxx.' },
          { name: 'conversationId', type: 'number', required: true, description: 'Existing numeric conversation id.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender phone number.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/conversations/194977?senderId=919999999999" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Get conversation',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "Conversation retrieved",
  "data": {
    "conversation": {
      "conversationId": 194977,
      "contactPhone": "919343841961",
      "contactName": "Prashant Tayal",
      "senderPhoneNumber": "919999999999",
      "lastMessageContent": "hi",
      "lastMessageDirection": "inbound",
      "unreadCount": 1,
      "totalMessages": 2,
      "status": "active",
      "labels": [
        { "uid": "lbl_support", "labelName": "Support" }
      ],
      "createdAt": "2026-06-05T06:08:48.000Z",
      "updatedAt": "2026-06-05T06:08:50.000Z"
    }
  }
}`,
            label: 'Conversation response',
          },
        ],
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "success": false,
  "message": "Conversation not found",
  "error_code": "CONVERSATION_NOT_FOUND",
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
        label: 'Not found response',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'conversations-messages',
    title: 'Messages',
    slug: 'messages',
    description: 'Retrieve paginated messages inside one conversation.',
    category: 'conversations',
    icon: 'MessageCircle',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Conversation Messages',
      },
      {
        type: 'paragraph',
        text: 'Endpoint: GET /api/v2/reports/conversations/{conversationId}/messages. Use this endpoint to retrieve paginated messages inside one conversation.',
      },
      {
        type: 'api',
        method: 'GET',
        endpoint: '/api/v2/reports/conversations/{conversationId}/messages',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_live_xxxxxxxxxxxxxxxxx.' },
          { name: 'conversationId', type: 'number', required: true, description: 'Existing numeric conversation id.' },
          { name: 'senderId', type: 'string', required: false, description: 'WhatsApp sender phone number.' },
          { name: 'direction', type: 'string', required: false, description: 'inbound or outbound.' },
          { name: 'messageType', type: 'string', required: false, description: 'text, image, video, document, interactive, etc.' },
          { name: 'status', type: 'string', required: false, description: 'pending, sent, delivered, read, failed, or all.' },
          { name: 'search', type: 'string', required: false, description: 'Matches message text.' },
          { name: 'page', type: 'number', required: false, description: 'Positive integer. Default 1.' },
          { name: 'limit', type: 'number', required: false, description: 'Positive integer. Default 50, max 200.' },
          { name: 'sortBy', type: 'string', required: false, description: 'timestamp, created_at, or updated_at.' },
          { name: 'sortOrder', type: 'string', required: false, description: 'ASC or DESC.' },
        ],
        request: [
          {
            language: 'curl',
            code: `curl "https://graph.whats91.com/api/v2/reports/conversations/194977/messages?senderId=919999999999&direction=inbound&page=1&limit=50" \\
  -H "Authorization: Bearer w91_live_xxx"`,
            label: 'Conversation messages',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
  }
}`,
            label: 'Messages response',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Raw inbound/outbound payload dumps, internal database user IDs, encrypted values, and access tokens are never returned.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Error Responses',
      },
      {
        type: 'table',
        headers: ['HTTP', 'Error code', 'Meaning'],
        rows: [
          ['401', 'MISSING_AUTH_TOKEN', 'No public token was supplied.'],
          ['401', 'INVALID_AUTH_TOKEN', 'Token is invalid, expired, revoked, or not tied to an active customer.'],
          ['403', 'SENDER_NOT_ALLOWED', 'Number-scoped token requested another sender.'],
          ['403', 'FEATURE_NOT_AVAILABLE', 'The customer does not have message reports access.'],
          ['400', 'WHATSAPP_SETUP_INCOMPLETE', 'Sender context could not resolve a usable WhatsApp number.'],
          ['400', 'VALIDATION_FAILED', 'Invalid date range, pagination, boolean, status, sort field, label mode, conversation id, or mobile number.'],
          ['404', 'CONVERSATION_NOT_FOUND', 'Conversation id does not belong to the authenticated customer and sender.'],
        ],
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "success": false,
  "message": "sortBy is not supported for conversations",
  "error_code": "VALIDATION_FAILED",
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
        label: 'Validation error example',
      },
    ],
  },

  // =========================================================================
  // CRM
  // =========================================================================
  {
    id: 'crm-lead-generation',
    title: 'Lead Generation',
    slug: 'lead-generation',
    description: 'Create CRM leads from public API integrations, Flow Builder custom API nodes, and tokenless company-URL submissions.',
    summary: 'Use CRM Lead Generation APIs to create company-scoped CRM leads through the canonical Whats91 public API v2 routes, with bearer-token authentication or a tokenless company-UID URL for controlled embedded workflows.',
    prerequisites: [
      'A Whats91 CRM company UID such as crmco_abc',
      'A global customer-level public API token for POST /api/v2/crm/leads',
      'A lead payload containing lead.fields with Email, MobilePhone, or Phone',
    ],
    seoTitle: 'CRM Lead Generation API | Whats91 Developer Documentation',
    seoDescription: 'Create Whats91 CRM leads through public API v2 using bearer-token or company-UID URL integrations, with field mapping, customer matching, responses, and error examples.',
    relatedSectionIds: ['crm-complaint-creation', 'contact-book-create', 'webhook-examples', 'conversations-list'],
    category: 'crm',
    icon: 'UsersRound',
    faqs: [
      {
        question: 'Which CRM lead endpoint should I use?',
        answer: 'Use POST /api/v2/crm/leads when your server can send a bearer token. Use POST /api/v2/crm/companies/{companyUid}/leads only when the integration cannot send an Authorization header and the CRM company UID is embedded in the URL.',
      },
      {
        question: 'Is companyUid required?',
        answer: 'companyUid is required in the JSON body for the bearer-token route. On the company-URL route, the companyUid path parameter is authoritative and the request body can omit companyUid.',
      },
      {
        question: 'How does CRM link leads to existing customers?',
        answer: 'CRM attempts email and phone matching inside the selected company before saving the lead. If a matching CRM customer or contact is found, the lead stores those CRM links; otherwise the lead is still created without a customer link.',
      },
    ],
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'CRM Lead Generation',
      },
      {
        type: 'paragraph',
        text: 'Create CRM leads in the dedicated Whats91 CRM database while keeping public API authentication in the main Whats91 backend. Lead creation is company-scoped and can automatically link new leads to existing CRM customers when email or phone values match.',
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'This phase documents Lead Generation only. Complaint Management APIs are intentionally not included here and will be documented in a later CRM phase.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Endpoint Overview',
      },
      {
        type: 'table',
        headers: ['Method', 'Path', 'Purpose'],
        rows: [
          ['POST', '/api/v2/crm/leads', 'Create a CRM lead with bearer-token authentication.'],
          ['POST', '/api/v2/crm/companies/{companyUid}/leads', 'Create a CRM lead through a company-UID URL without bearer-token authentication.'],
        ],
      },
      {
        type: 'cards',
        cards: [
          {
            title: 'Bearer-token route',
            value: 'POST /crm/leads',
            description: 'Use this server-side route when your integration can send Authorization: Bearer w91_public_token_here. The JSON body must include companyUid.',
            tone: 'green',
          },
          {
            title: 'Tokenless company-URL route',
            value: 'POST /companies/{companyUid}/leads',
            description: 'Use this tokenless company-URL route for controlled form or Flow Builder submissions where the company UID is embedded in the endpoint URL.',
            tone: 'blue',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Authentication',
      },
      {
        type: 'paragraph',
        text: 'The bearer-token route requires a global public API token. Number-scoped public API tokens are rejected with TOKEN_SCOPE_NOT_ALLOWED because CRM leads are company-scoped resources, not sender-scoped resources.',
      },
      {
        type: 'code',
        language: 'http',
        code: 'Authorization: Bearer w91_public_token_here',
        label: 'Bearer token header',
      },
      {
        type: 'paragraph',
        text: 'For POST compatibility, authToken, auth_token, or token can also be sent in the JSON body. The bearer token takes precedence when both header and body tokens are present.',
      },
      {
        type: 'paragraph',
        text: 'For the company-URL route, do not send an Authorization header. The companyUid in the URL selects the target CRM company and customer context. If companyUid is also present in the request body, the URL companyUid remains the source of truth.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Create Lead With Bearer Token',
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/crm/leads',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here. Must be a global customer-level public API token.' },
          { name: 'Content-Type', type: 'header', required: true, description: 'Use application/json.' },
          { name: 'companyUid', type: 'string', required: true, description: 'CRM company UID because the bearer-token URL is static.' },
          { name: 'lead.fields', type: 'object', required: true, description: 'Lead field object. Include Email, MobilePhone, or Phone.' },
        ],
        request: [
          {
            language: 'json',
            code: `{
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
}`,
            label: 'Bearer-token request body',
          },
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/crm/leads" \\
  -H "Authorization: Bearer w91_public_token_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "companyUid": "crmco_abc",
    "lead": {
      "fields": {
        "FirstName": "Asha",
        "LastName": "Patel",
        "Company": "Acme Pvt Ltd",
        "Email": "asha@example.com",
        "MobilePhone": "919999999999",
        "Description": "Needs a CRM follow-up",
        "Priority": "high",
        "ExternalReferenceId": "sf-lead-1"
      }
    }
  }'`,
            label: 'Create lead with bearer token',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
      "source": {
        "sourceUid": "crmlsrc_web",
        "uid": "crmlsrc_web",
        "name": "Website"
      },
      "status": {
        "statusUid": "crmlstat_new",
        "uid": "crmlstat_new",
        "name": "New"
      },
      "recordStatus": "active",
      "createdAt": "2026-06-16T08:00:00.000Z",
      "updatedAt": "2026-06-16T08:00:00.000Z"
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Success Response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Create Lead With Company UID URL',
      },
      {
        type: 'paragraph',
        text: 'Use the company-URL route for tokenless form submissions or Flow Builder Custom API nodes where the CRM company UID is already embedded in the endpoint URL.',
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/crm/companies/{companyUid}/leads',
        parameters: [
          { name: 'Content-Type', type: 'header', required: true, description: 'Use application/json.' },
          { name: 'companyUid', type: 'path', required: true, description: 'CRM company UID in the URL. This value is the source of truth.' },
          { name: 'lead.fields', type: 'object', required: true, description: 'Lead field object. Include Email, MobilePhone, or Phone.' },
        ],
        request: [
          {
            language: 'json',
            code: `{
  "lead": {
    "fields": {
      "Email": "asha@example.com",
      "MobilePhone": "919999999999",
      "Description": "Lead captured from a Whats91 flow"
    }
  }
}`,
            label: 'Tokenless request body',
          },
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/crm/companies/crmco_abc/leads" \\
  -H "Content-Type: application/json" \\
  -d '{
    "lead": {
      "fields": {
        "Email": "asha@example.com",
        "MobilePhone": "919999999999",
        "Description": "Lead captured from a Whats91 flow"
      }
    }
  }'`,
            label: 'Create lead with company UID URL',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "CRM lead created",
  "data": {
    "lead": {
      "leadUid": "crml_abc",
      "uid": "crml_abc",
      "email": "asha@example.com",
      "mobileNumber": "919999999999",
      "captureMethod": "api",
      "recordStatus": "active"
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Tokenless success response',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'The company-URL route is tokenless by design. Only expose URLs for companies and workflows where URL-based lead capture is acceptable.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Flow Builder Custom API Setup',
      },
      {
        type: 'table',
        headers: ['Setup', 'Bearer-token route', 'Tokenless company-URL route'],
        rows: [
          ['Endpoint URL', 'https://graph.whats91.com/api/v2/crm/leads', 'https://graph.whats91.com/api/v2/crm/companies/crmco_abc/leads'],
          ['Auth Mode', 'Bearer token', 'No auth / URL-based access'],
          ['Bearer Token', '{{variables.crm_public_api_token}} or another saved flow variable', 'Leave blank'],
          ['Payload', 'Must include companyUid and lead.fields', 'Should omit companyUid and include lead.fields'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Request Fields',
      },
      {
        type: 'paragraph',
        text: 'The request body must contain a lead.fields object. Unsupported fields are rejected with VALIDATION_FAILED so lead data is not silently dropped. At least one contact value is required: Email, MobilePhone, or Phone. Name and company fields are optional and are never required for public lead creation.',
      },
      {
        type: 'table',
        headers: ['Field', 'CRM mapping', 'Notes'],
        rows: [
          ['LeadTitle', 'leadTitle', 'Optional. Defaults from full name when omitted.'],
          ['FirstName', 'firstName', 'Optional.'],
          ['LastName', 'lastName', 'Optional.'],
          ['Name / FullName', 'fullName', 'Optional. If omitted, first and last name are combined.'],
          ['Company', 'prospectCompanyName', 'Optional prospect company name.'],
          ['Title', 'jobTitle', 'Optional job title.'],
          ['Email', 'email', 'Optional, lowercased by CRM validation.'],
          ['MobilePhone', 'mobileNumber', 'Optional mobile number.'],
          ['Phone', 'alternatePhone', 'Optional phone number. Also used for customer matching when MobilePhone is absent.'],
          ['Website', 'website', 'Optional website URL or text.'],
          ['Street / Address', 'address', 'Optional address line.'],
          ['City', 'city', 'Optional.'],
          ['State', 'state', 'Optional.'],
          ['Country', 'country', 'Optional.'],
          ['PostalCode / Pincode', 'pincode', 'Optional.'],
          ['Description', 'requirementSummary', 'Optional notes or requirement summary.'],
          ['LeadSourceUid', 'leadSourceUid', 'Optional CRM lead source UID. Omit to use CRM default.'],
          ['StatusUid', 'statusUid', 'Optional CRM lead status UID. Omit to use CRM default.'],
          ['OwnerPrincipalKey', 'ownerPrincipalKey', 'Optional CRM owner principal key, such as a permitted team member.'],
          ['Priority', 'priority', 'Optional: low, medium, high, or urgent.'],
          ['LeadScore', 'leadScore', 'Optional integer.'],
          ['EstimatedValue', 'estimatedValue', 'Optional numeric value.'],
          ['ExternalReferenceType', 'externalReferenceType', 'Optional external system type.'],
          ['ExternalReferenceId', 'externalReferenceId', 'Optional external id. If provided without a type, the type defaults to public_api.'],
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'The current CRM lead table does not store Salesforce CurrencyCode or ExpectedClosureDate, so those fields are rejected until the CRM lead schema is extended.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Automatic Customer Matching',
      },
      {
        type: 'list',
        items: [
          'CRM checks existing customer data for the same companyUid after validation and before saving the lead.',
          'Email matching is exact after normalizing case and surrounding spaces.',
          'Customer contacts and customer primary email are both checked.',
          'Phone matching treats MobilePhone and Phone as lead contact numbers.',
          'Phone values are normalized to digits before matching, so plus signs, spaces, hyphens, brackets, and dots do not affect matching.',
          'Exact digit matches are checked first across customer mobile and WhatsApp fields.',
          'For Indian customers, CRM also matches the last 10 digits, so +91 98765 43210 and 9876543210 resolve to the same customer.',
          'Mobile and WhatsApp numbers are treated equally for matching.',
        ],
      },
      {
        type: 'paragraph',
        text: 'If a match is found, the lead stores the linked CRM customer and, when the match came from a contact row, the linked CRM customer contact. If no match is found, the lead is still created normally without a customer link.',
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Internal database ids, Whats91 user ids, and private token details are never returned in public CRM lead responses.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Error Responses',
      },
      {
        type: 'table',
        headers: ['HTTP', 'Error code', 'Cause'],
        rows: [
          ['400', 'VALIDATION_FAILED', 'Missing body companyUid on the bearer-token route, missing lead.fields, unsupported field, invalid priority, invalid capture method, or CRM lead validation failure.'],
          ['401', 'MISSING_AUTH_TOKEN', 'Bearer-token route only: no bearer token or compatible token body field was provided.'],
          ['401', 'INVALID_AUTH_TOKEN', 'Bearer-token route only: the public API token is invalid.'],
          ['403', 'TOKEN_SCOPE_NOT_ALLOWED', 'Bearer-token route only: a number-scoped public API token was used.'],
          ['403', 'CUSTOMER_TOKEN_REQUIRED', 'Bearer-token route only: the token does not belong to a customer account.'],
          ['403', 'FORBIDDEN', 'Company-URL route only: the CRM company is inactive.'],
          ['404', 'NOT_FOUND', 'The CRM company or referenced CRM setup row was not found.'],
        ],
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "success": false,
  "message": "Missing required field: companyUid",
  "error_code": "VALIDATION_FAILED",
  "details": {},
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
        label: 'Validation Error Response',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'crm-complaint-creation',
    title: 'Complaint Creation',
    slug: 'complaint-creation',
    description: 'Create CRM complaints from public API integrations, customer forms, Flow Builder custom API nodes, and tokenless company-URL submissions.',
    summary: 'Use CRM Complaint Creation APIs to create company-scoped complaint tickets through the canonical Whats91 public API v2 routes, with bearer-token authentication or a tokenless company-UID URL for controlled embedded intake workflows.',
    prerequisites: [
      'A Whats91 CRM company UID such as crmco_abc',
      'A global customer-level public API token for POST /api/v2/crm/complaints',
      'A complaint payload containing complaint.fields with ComplaintTitle and Description',
    ],
    seoTitle: 'CRM Complaint Creation API | Whats91 Developer Documentation',
    seoDescription: 'Create Whats91 CRM complaints through public API v2 using bearer-token or company-UID URL integrations, with field mapping, customer matching, responses, and error examples.',
    relatedSectionIds: ['crm-lead-generation', 'webhook-examples', 'conversations-list', 'reports-all'],
    category: 'crm',
    icon: 'UsersRound',
    faqs: [
      {
        question: 'Which CRM complaint endpoint should I use?',
        answer: 'Use POST /api/v2/crm/complaints when your server can send a bearer token. Use POST /api/v2/crm/companies/{companyUid}/complaints only when the integration cannot send an Authorization header and the CRM company UID is embedded in the URL.',
      },
      {
        question: 'Which complaint fields are required?',
        answer: 'complaint.fields must include a complaint title and description. Supported title aliases include ComplaintTitle, Subject, and Title. Supported description aliases include Description, Message, and Issue.',
      },
      {
        question: 'Can CRM match complaints to existing customers?',
        answer: 'Yes. When Email, MobilePhone, MobileNumber, or Phone is present, CRM normalizes contact values and attempts to link the complaint to an existing customer or contact in the selected company.',
      },
    ],
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'CRM Complaint Creation',
      },
      {
        type: 'paragraph',
        text: 'Create CRM complaint tickets in the dedicated Whats91 CRM database while keeping public API authentication in the main Whats91 backend. Complaint creation is company-scoped and can automatically link complaints to existing CRM customers when email or phone values match.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Endpoint Overview',
      },
      {
        type: 'table',
        headers: ['Method', 'Path', 'Purpose'],
        rows: [
          ['POST', '/api/v2/crm/complaints', 'Create a CRM complaint with bearer-token authentication.'],
          ['POST', '/api/v2/crm/companies/{companyUid}/complaints', 'Create a CRM complaint through a company-UID URL without bearer-token authentication.'],
        ],
      },
      {
        type: 'cards',
        cards: [
          {
            title: 'Bearer-token route',
            value: 'POST /crm/complaints',
            description: 'Use this server-side route when your integration can send Authorization: Bearer w91_public_token_here. The JSON body must include companyUid.',
            tone: 'green',
          },
          {
            title: 'Tokenless company-URL route',
            value: 'POST /companies/{companyUid}/complaints',
            description: 'Use this tokenless company-URL route for controlled customer forms or Flow Builder submissions where the company UID is embedded in the endpoint URL.',
            tone: 'blue',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Authentication',
      },
      {
        type: 'paragraph',
        text: 'The bearer-token route requires a global public API token. Number-scoped public API tokens are rejected with TOKEN_SCOPE_NOT_ALLOWED because CRM complaints are company-scoped resources, not sender-scoped resources.',
      },
      {
        type: 'code',
        language: 'http',
        code: 'Authorization: Bearer w91_public_token_here',
        label: 'Bearer token header',
      },
      {
        type: 'paragraph',
        text: 'For POST compatibility, authToken, auth_token, or token can also be sent in the JSON body. The bearer token takes precedence when both header and body tokens are present.',
      },
      {
        type: 'paragraph',
        text: 'For the company-URL route, do not send an Authorization header. The companyUid in the URL selects the target CRM company. If companyUid is also present in the request body, the URL companyUid remains the source of truth.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Create Complaint With Bearer Token',
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/crm/complaints',
        parameters: [
          { name: 'Authorization', type: 'header', required: true, description: 'Bearer w91_public_token_here. Must be a global customer-level public API token.' },
          { name: 'Content-Type', type: 'header', required: true, description: 'Use application/json.' },
          { name: 'companyUid', type: 'string', required: true, description: 'CRM company UID because the bearer-token URL is static.' },
          { name: 'complaint.fields', type: 'object', required: true, description: 'Complaint field object. Include ComplaintTitle and Description or supported aliases.' },
        ],
        request: [
          {
            language: 'json',
            code: `{
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
}`,
            label: 'Bearer-token request body',
          },
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/crm/complaints" \\
  -H "Authorization: Bearer w91_public_token_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "companyUid": "crmco_abc",
    "complaint": {
      "fields": {
        "ComplaintTitle": "WhatsApp API is not working",
        "Description": "Customer reports API failures since morning.",
        "CustomerName": "Dev Test",
        "Email": "person@example.com",
        "MobilePhone": "919999999999",
        "PriorityUid": "crmcp_low",
        "ExternalReferenceId": "flow-ticket-1001"
      }
    }
  }'`,
            label: 'Create complaint with bearer token',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
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
}`,
            label: 'Success Response',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Create Complaint With Company UID URL',
      },
      {
        type: 'paragraph',
        text: 'Use the company-URL route for tokenless submissions when the integration cannot pass an Authorization header. The request body can omit companyUid because the URL value is authoritative.',
      },
      {
        type: 'api',
        method: 'POST',
        endpoint: '/api/v2/crm/companies/{companyUid}/complaints',
        parameters: [
          { name: 'Content-Type', type: 'header', required: true, description: 'Use application/json.' },
          { name: 'companyUid', type: 'path', required: true, description: 'CRM company UID in the URL. This value is the source of truth.' },
          { name: 'complaint.fields', type: 'object', required: true, description: 'Complaint field object. Include title and description fields.' },
        ],
        request: [
          {
            language: 'json',
            code: `{
  "complaint": {
    "fields": {
      "Subject": "Billing issue",
      "Message": "Invoice total does not match the order.",
      "Phone": "+91 99999 99999"
    }
  }
}`,
            label: 'Tokenless request body',
          },
          {
            language: 'curl',
            code: `curl -X POST "https://graph.whats91.com/api/v2/crm/companies/crmco_abc/complaints" \\
  -H "Content-Type: application/json" \\
  -d '{
    "complaint": {
      "fields": {
        "Subject": "Billing issue",
        "Message": "Invoice total does not match the order.",
        "Phone": "+91 99999 99999"
      }
    }
  }'`,
            label: 'Create complaint with company UID URL',
          },
        ],
        response: [
          {
            language: 'json',
            code: `{
  "success": true,
  "message": "CRM complaint created",
  "data": {
    "complaint": {
      "complaintUid": "crmc_abc",
      "uid": "crmc_abc",
      "complaintNumber": "CMP-00001",
      "complaintTitle": "Billing issue",
      "description": "Invoice total does not match the order.",
      "submittedMobileNumber": "9999999999",
      "intakeMethod": "api",
      "recordStatus": "active"
    }
  },
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
            label: 'Tokenless success response',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'The company-URL complaint route is tokenless by design. Use it only for controlled complaint intake workflows where URL-based access is acceptable.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Request Body',
      },
      {
        type: 'paragraph',
        text: 'The request body must contain a complaint.fields object. ComplaintTitle and Description are required, though Subject or Title can be used for the title and Message or Issue can be used for the description. Unsupported fields are rejected with VALIDATION_FAILED.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Supported Fields',
      },
      {
        type: 'table',
        headers: ['Field', 'CRM mapping'],
        rows: [
          ['ComplaintTitle / Subject / Title', 'complaintTitle'],
          ['Description / Message / Issue', 'description'],
          ['CustomerName / Name', 'submittedCustomerName'],
          ['Company / CompanyName', 'submittedCompanyName'],
          ['Email', 'submittedEmail'],
          ['MobilePhone / MobileNumber / Phone', 'submittedMobileNumber'],
          ['Address', 'submittedAddress'],
          ['SourceUid / ComplaintSourceUid', 'sourceUid'],
          ['StatusUid', 'statusUid'],
          ['PriorityUid', 'priorityUid'],
          ['CategoryUid', 'categoryUid'],
          ['QueueUid', 'queueUid'],
          ['AssigneePrincipalKey', 'assigneePrincipalKey'],
          ['ExternalReferenceType', 'externalReferenceType'],
          ['ExternalReferenceId', 'externalReferenceId'],
          ['RelatedOrderReference', 'relatedOrderReference'],
          ['NextFollowUpAt', 'nextFollowUpAt'],
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'If ExternalReferenceId is provided without ExternalReferenceType, the type defaults to public_api. Public complaints are saved with intakeMethod: "api".',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Customer Matching',
      },
      {
        type: 'list',
        items: [
          'CRM attempts to link the complaint to an existing account or contact in the same company when email or phone data is present.',
          'Email matching is exact after trimming and lowercasing.',
          'Phone values are normalized to digits before matching.',
          'Mobile and WhatsApp numbers are treated equally.',
          'For India, CRM also matches the last 10 digits so values with or without +91 resolve to the same customer.',
          'If no customer is found, the complaint is still created normally.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Response Headers',
      },
      {
        type: 'list',
        items: [
          'X-Whats91-Request-Id: request id for support and log correlation.',
          'X-Whats91-Crm-Complaint-Uid: public CRM complaint UID created by the request.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Internal database ids, Whats91 user ids, tokens, encrypted values, and raw private payloads are never returned in public CRM complaint responses.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Error Responses',
      },
      {
        type: 'table',
        headers: ['HTTP', 'Error code', 'Cause'],
        rows: [
          ['400', 'VALIDATION_FAILED', 'Missing companyUid, missing complaint.fields, missing title/description, unsupported field, or CRM complaint validation failure.'],
          ['401', 'MISSING_AUTH_TOKEN', 'Bearer-token route only: no bearer token or compatible token body field was provided.'],
          ['401', 'INVALID_AUTH_TOKEN', 'Bearer-token route only: the public API token is invalid.'],
          ['403', 'TOKEN_SCOPE_NOT_ALLOWED', 'Bearer-token route only: a number-scoped public API token was used.'],
          ['403', 'CUSTOMER_TOKEN_REQUIRED', 'Bearer-token route only: the token does not belong to a customer account.'],
          ['403', 'FORBIDDEN', 'Company-URL route only: the CRM company is inactive or unavailable for public access.'],
          ['404', 'NOT_FOUND', 'The CRM company or referenced CRM setup row was not found.'],
        ],
      },
      {
        type: 'code',
        language: 'json',
        code: `{
  "success": false,
  "message": "Complaint title and description are required",
  "error_code": "VALIDATION_FAILED",
  "details": {},
  "metadata": {
    "apiVersion": "v2",
    "requestId": "request-uuid"
  }
}`,
        label: 'Validation Error Response',
      },
    ],
  },

  // =========================================================================
  // CHANGELOG
  // =========================================================================
  {
    id: 'changelog',
    title: 'Changelog',
    slug: 'changelog',
    description: 'Complete changelog of Whats91 platform releases and developer updates.',
    category: 'changelog',
    icon: 'GitCommitHorizontal',
    content: [
      {
        type: 'heading',
        level: 1,
        text: 'Changelog',
      },
      {
        type: 'paragraph',
        text: 'Release notes for Whats91 versions 1.2.0, 1.0.2, 1.0.1, and 1.0.0, including dashboard routing, Flow Builder automation, campaign reliability, reporting, billing, AI tools, platform, partner, API, and developer tooling updates.',
      },
      {
        type: 'divider',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Changelog entries
// ---------------------------------------------------------------------------

export const changelogEntries: ChangelogEntry[] = [
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Dashboard, Flow Builder, campaigns, reports, and developer workflows',
    type: 'improvement',
    description:
      'Improved dashboard return paths, Flow Builder automation, campaign reliability, report filtering, and developer-facing configuration workflows.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: Dashboard return path after login',
    type: 'fix',
    description:
      'Preserved the originally requested dashboard page during unauthenticated redirects so users return to pages like API Tokens after login instead of always landing on the dashboard.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: AI Brain fallback marker display',
    type: 'fix',
    description:
      'AI Brain playground fallback answers now show the fallback badge without repeating the raw `[FALLBACK]` marker in the chat bubble.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: Flow Usage session report loading',
    type: 'fix',
    description:
      'Flow Usage session reports no longer fail with incorrect MySQL prepared-statement arguments when loading journey sessions.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: Campaign opt-out keyword handling',
    type: 'fix',
    description:
      'Campaign opt-out keyword handling now records `UNSUBSCRIBE` reliably, avoids the webhook-side `userId is not defined` crash, adds standalone opt-outs to the sender-scoped blacklist, and keeps opt-out/resubscribe handling ahead of flows, chatbots, and AI bots.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: Campaign unsubscribe confirmations',
    type: 'fix',
    description:
      'Campaign unsubscribe confirmation messages now send consistently after `UNSUBSCRIBE` by allowing the opt-out system reply to bypass only the newly-created sender blacklist row.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: Customer sidebar upcoming tag alignment',
    type: 'fix',
    description:
      'Customer sidebar upcoming tags now sit at the row edge without changing the original icon-to-label alignment for main menus.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: Campaign throttle requeue behavior',
    type: 'fix',
    description:
      'Campaign throttle setting changes now requeue campaigns waiting on `CAMPAIGN_THROTTLE_WINDOW_CLOSED` so they are rechecked against the updated sending window immediately.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: Campaign worker skipped-state reporting',
    type: 'fix',
    description:
      'Campaign workers now record retry-expired, subscription-blocked, and billing-blocked jobs as internal not-sent/skipped states when Meta was never called, preventing false `message_failed` rows and false campaign failure rates.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: All Messages origin classification',
    type: 'fix',
    description:
      'All Messages now classifies message-event origin and hides uncorrelated coexisting/mobile-app webhook activity, while retaining report rows for Whats91-sent messages and matching Meta status/reply updates.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: All Messages outbound filtering',
    type: 'fix',
    description:
      'All Messages outbound filtering now keeps report-visible Meta status rows even when older/imported sends do not have a same-table outbound event, restoring valid API and campaign messages while still hiding coexisting/unmatched rows through `report_visible`.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: Partner customer management actions',
    type: 'fix',
    description:
      'Partner Customer management now gives normal partners the same assigned-customer actions as Tech Partners, including edit, cache clear, impersonation, and customer creation.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: Contact import phonebook return state',
    type: 'fix',
    description:
      'Contact import now preserves the selected phonebook when returning from regular or grid imports, adds a completed grid-import back button, and keeps the Contacts menu responsive by syncing phonebook selection with the `groupUid` URL.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: Campaign retry-expiry throttle deferrals',
    type: 'fix',
    description:
      'Campaign throttle deferrals are now capped at the job retry-expiry boundary and throttle-setting changes also requeue old zero-attempt `RETRY_EXPIRED` rows that were created before Meta dispatch.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: Campaign log cleanup scheduler',
    type: 'fix',
    description:
      'Campaign log cleanup now runs through the backend Node-cron scheduler after migrations, using `CAMPAIGN_LOG_CLEANUP_CRON` and `CAMPAIGN_LOG_CLEANUP_TIMEZONE` instead of requiring a separate system cron entry.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: Campaign Builder draft confirmation actions',
    type: 'fix',
    description:
      'Campaign Builder draft confirmation actions now stay aligned in one row, with the discard action styled as a destructive red button.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: Report summary metrics under stat filters',
    type: 'fix',
    description:
      'All Messages and Campaign Reports keep their summary metric counts intact when a status stat filter is applied, so filtered rows change without zeroing the overall stat cards.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: Stale report API responses',
    type: 'fix',
    description:
      'Report data loaders now guard against stale API responses overwriting newer filter results.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: Message Billing stale filter responses',
    type: 'fix',
    description:
      'Message Billing now uses the branded report loader and ignores stale billing responses when filters change.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: Template copy media preservation',
    type: 'fix',
    description:
      'Template copy now preserves existing JPG, PDF, video, and document header media by preselecting reusable source media in the new template form and resolving source-template media on submit when the upload cache has expired.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Fixed: WhatsApp Cloud API Fresh Register flow',
    type: 'fix',
    description:
      'WhatsApp Cloud API setup now offers Fresh Register instead of Replace, deleting and recreating the selected setup row from Meta while keeping the same setup reference for sender-scoped configuration.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Customer AI Profiles',
    type: 'feature',
    description:
      'Customer AI Profiles under the AI menu for encrypted provider credentials, model defaults, full-page editing, and saved-profile testing.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Customer AI Brains',
    type: 'feature',
    description:
      'Customer AI Brains under the AI menu with linked AI Profiles, text contracts, copied markdown instructions, playground testing, fallback detection, and basic analytics.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Flow journey tracking',
    type: 'feature',
    description:
      'Flow journey tracking now records flow sessions, stages, transitions, messages, user inputs, timeouts, abandonment, and completion status in the flow database, with a new customer Flow Usage report under Automation.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Flow Usage cleanup cron',
    type: 'feature',
    description:
      'Main backend Flow Usage cleanup cron now removes flow journey report data older than 15 days from the flow database.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Internal template dispatch and Talk to Agent node',
    type: 'feature',
    description:
      'Reusable internal template dispatch API for Whats91 systems and a new Flow Builder Talk to Agent node can notify agents through approved WhatsApp templates.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Branded GlobalLoader',
    type: 'feature',
    description:
      'Reusable branded `GlobalLoader` component using the Whats91 logo, first applied to All Messages and Campaign Reports while report data is loading.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Campaign Builder template-aware opt-out defaults',
    type: 'feature',
    description:
      'Campaign Builder templates with `Unsubscribe`, `Opt-Out`, `Stop`, or `Not Interested` quick replies now auto-enable opt-out, select the initial message button, and fill the report label while still allowing edits.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Campaign Builder save-draft support',
    type: 'feature',
    description:
      'Campaign Builder save-draft support adds a header Save Draft action and a leave prompt that can save, discard, or continue editing.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Public API v1 sendtemplate PDF image conversion',
    type: 'feature',
    description:
      'Public API v1 `sendtemplate` now supports optional `sendAsImage` / `send_as_image` PDF invoice conversion for approved image-header templates.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Administrator Customer report filters and export columns',
    type: 'feature',
    description:
      'Administrator Customer report now supports Billing managed by and Chat access filters, conditional Yes/No coloring, and Excel export with Meta registered phone, `phone_number_id`, and `waba_id`.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Customer template footer field',
    type: 'feature',
    description:
      "Customer template creation now exposes Meta's optional footer text field for non-authentication templates and submits it through the existing footer component payload.",
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Template category badges and campaign retry defaults',
    type: 'feature',
    description:
      'Campaign Builder now shows colored Marketing, Utility, and Authentication badges in template selection dropdowns, final review summaries, and directly above the launch button, and new campaigns default retry expiry to two days after creation.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Meta template webhook status sync',
    type: 'feature',
    description:
      'Meta template approval, rejection, and category webhooks now sync local template status/category data and can notify customers through configured WhatsApp templates.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Template webhook customer notifications',
    type: 'feature',
    description:
      'Template webhook customer notifications now use the generic company notification sender configured by `NOTIFICATION_SENDER_ID`, avoiding customer-specific sender fallbacks.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Internal template notification context',
    type: 'feature',
    description:
      'Internal template dispatch now supports `notification_context` so template notifications use the company notification sender while Flow Builder notifications keep the customer sender.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Template webhook lookup indexes',
    type: 'feature',
    description:
      'Template webhook lookup indexes now use MySQL-safe prefix lengths so startup migrations do not fail on long template name columns.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Added: Customer account profile updates',
    type: 'feature',
    description:
      'Customer dashboard headers now let signed-in customers open an account profile form from their name/email and update only their email ID, password, or WhatsApp mobile number; password changes require confirmation and mobile changes require country-code selection plus WhatsApp OTP verification.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Flow Builder inbound trigger defaults',
    type: 'improvement',
    description:
      'New Flow Builder inbound-message trigger nodes now default to Exact match instead of Any keyword.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Flow Builder media previews',
    type: 'improvement',
    description:
      'Flow Builder message nodes now show attached image media as inline thumbnails and PDF, Excel, Word, or fallback document media as clear file-type chips.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Flow Builder node header spacing',
    type: 'improvement',
    description:
      'Flow Builder node headers are now slimmer with balanced vertical padding and no default title/subtitle paragraph spacing.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Flow Builder mixed-media message nodes',
    type: 'improvement',
    description:
      'Flow Builder message nodes now support up to 10 mixed media attachments with per-item captions and media-first webhook delivery.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Flow Builder timeout and action paths',
    type: 'improvement',
    description:
      'Flow Builder timeout and action paths can now route to Talk to Agent, with mandatory template-based agent alerts and optional customer text notifications.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: AI Brain markdown instruction copy actions',
    type: 'improvement',
    description:
      'AI Brain Markdown instructions now provide separate website and document copy buttons with source-specific Brain Contract extraction prompts and no embedded Brain-specific values.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Campaign Builder throttle defaults',
    type: 'improvement',
    description:
      'Campaign Builder throttle defaults now use a wider `05:00` to `23:00` sending window for new/default settings.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Campaign opt-out defaults',
    type: 'improvement',
    description:
      'Campaign opt-out defaults now include `NOT INTERESTED` for opt-out and `INTERESTED` for re-subscribe keyword handling.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Developer REST API dashboard documentation',
    type: 'improvement',
    description:
      'Developer REST API dashboard documentation now shows a moved-docs notice and opens the maintained external developer site in a new tab.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Flow Usage, Chat Shortcuts, and Customer Add-ons page density',
    type: 'improvement',
    description:
      'Flow Usage, Chat Shortcuts, and Customer Add-ons pages were tightened by removing redundant hero/header panels, moving key actions into the dashboard header, reducing excess padding, and making pagination/action visibility more contextual.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: All Messages stat card quick filters',
    type: 'improvement',
    description:
      'All Messages report stat cards are now clickable quick filters for statuses such as total, read, pending, duplicate, and failed; the filter resets naturally on a page reload.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Campaign Reports stat quick filters',
    type: 'improvement',
    description:
      'Campaign Reports now match the All Messages quick-filter behavior on campaign list and campaign detail stats, with report-area loading overlays while filters refresh.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Campaign Reports mobile filters',
    type: 'improvement',
    description:
      'Campaign Reports now use the compact All Messages-style two-column mobile layout for list and detail filters while preserving desktop report layouts.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Message Billing runtime indexes',
    type: 'improvement',
    description:
      'Message Billing runtime indexes now cover common customer billing report filters on the separate billing database.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Message Billing aggregate sender view',
    type: 'improvement',
    description:
      'Message Billing now defaults to an explicit all-linked-numbers aggregate view, with a sender filter for viewing billing rows and summaries for one registered Meta number while shared wallet balances remain account-wide.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Administrator Wallet Management customer search',
    type: 'improvement',
    description:
      'Administrator Wallet Management now uses the same customer search styling and debounced customer lookup as the Subscription form when adding wallet transactions.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Administrator Customer WABA search',
    type: 'improvement',
    description:
      'Administrator Customer search now matches Cloud API WABA IDs through `cloud_api_setup.whatsapp_business_account_id`, backed by a new runtime index for faster WABA lookup.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Customer sidebar upcoming section',
    type: 'improvement',
    description:
      'Customer sidebar now moves AI, Orders, Catalog Management, and WA Group into the bottom upcoming section with visible `Upcoming` tags.',
  },
  {
    date: '2026-06-11',
    version: '1.2.0',
    title: 'Changed: Talk to Agent phone and parameter handling',
    type: 'improvement',
    description:
      'Talk to Agent node setup now accepts country-code phone numbers without requiring a leading plus sign and uses clear parameter dropdown labels such as incoming phone number, last incoming message text, flow name, and session references.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Fixed: Webhook chat-access cache safety',
    type: 'fix',
    description:
      'Improved webhook chat-access cache safety so enabled chats do not miss inbound messages.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Fixed: Cloud API setup recheck for stale chat cache',
    type: 'fix',
    description:
      'Rechecked the Cloud API setup from the database when webhook cache reports `access_chats` disabled, preventing stale cache from skipping inbound conversation inserts.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Fixed: Chat-access cache invalidation on admin toggle',
    type: 'fix',
    description:
      'Invalidated WhatsApp-number setup cache immediately when administrators toggle chat access for a customer.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Added: Partner and Tech Partner account subtypes',
    type: 'feature',
    description:
      'Added Partner and Tech Partner subtypes for partner accounts while keeping the shared partner login flow.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Added: Partner role controls and pricing overrides',
    type: 'feature',
    description:
      'Added administrator controls to upgrade or downgrade partners, role badges in partner/admin UI, and role-specific subscription/add-on pricing overrides.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Added: Partner subscription plan visibility toggle',
    type: 'feature',
    description:
      'Added an administrator-controlled subscription plan visibility toggle so plans stay hidden from partner screens unless explicitly enabled.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Added: Whats91 Coins allocation ledger',
    type: 'feature',
    description:
      'Added phase-one Whats91 Coins allocation with administrator ledger entries, GST/tax audit values, and partner read-only balance/history views.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Added: Partner read-only Plans menu',
    type: 'feature',
    description:
      'Added a partner read-only Plans menu that lists subscription plans marked visible to partners with Partner/Tech Partner pricing applied.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Added: Partner subscription activation with Whats91 Coins',
    type: 'feature',
    description:
      'Added partner subscription activation using Whats91 Coins for assigned customers, including balance validation, idempotent activation requests, and negative spend ledger rows.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Added: Partner project registration links',
    type: 'feature',
    description:
      'Added unique partner project registration links so customers registering from a partner link are automatically assigned to that partner.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Added: Public API v2 webhook management endpoints',
    type: 'feature',
    description:
      'Added public API v2 webhook management endpoints for listing event keys, creating Webhooks v2 destinations, listing/retrieving webhooks, and updating existing webhook UIDs.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Added: Public API v2 message reporting endpoints',
    type: 'feature',
    description:
      'Added public API v2 message reporting endpoints for paginated message reports, message status lookup, mobile-number history, campaign reports, campaign responses, and delivery analytics.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Added: Public API v2 billing endpoints',
    type: 'feature',
    description:
      'Added public API v2 billing endpoints for user-wide and sender-scoped message billing history, template-category billing, delivered/payable/free records, billing summaries, and wallet history.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Added: Public API v2 chatbot creation endpoints',
    type: 'feature',
    description:
      'Added public API v2 chatbot creation endpoints for text, public media URL, button, CTA, and list-response chatbots, plus list/get APIs for existing chatbots.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Added: Public API v2 contact book endpoints',
    type: 'feature',
    description:
      'Added public API v2 contact book management endpoints for listing books, reading contacts, creating/updating books, and JSON bulk contact uploads.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Added: Public API v2 blacklist endpoints',
    type: 'feature',
    description:
      'Added public API v2 message blacklist management endpoints for listing, retrieving, adding, updating, and soft-removing sender-scoped blocked recipients.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Added: Public API v2 conversation report endpoints',
    type: 'feature',
    description:
      'Added public API v2 conversation report endpoints for listing conversations, summary counts, by-mobile threads, conversation detail, and paginated conversation messages.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Added: Dedicated message-sending documentation split',
    type: 'feature',
    description:
      'Added a dedicated public API v2 message-sending documentation file that separates Whats91-specific send/chat APIs from Meta-compatible message APIs.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Changed: Normal Partner and Tech Partner access boundaries',
    type: 'improvement',
    description:
      'Normal Partner accounts now keep read-only customer access, while Tech Partner accounts retain customer edit, cache flush, and impersonation actions.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Changed: Partner subscription plan visibility',
    type: 'improvement',
    description:
      'Partner subscription views now show only plans marked visible to partners, keeping internal administrator-only plans hidden.',
  },
  {
    date: '2026-06-06',
    version: '1.0.2',
    title: 'Changed: Partner Coins ledger display',
    type: 'improvement',
    description:
      'Partner Coins now displays a unified coin ledger with both incoming administrator allocations and outgoing subscription activation spends.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Added: Contact book duplicate maintenance baseline',
    type: 'feature',
    description:
      'Improved contact book maintenance with duplicate phone cleanup and safer selection behavior.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Added: Partner password login support',
    type: 'feature',
    description:
      'Added partner password login support with a required business profile form before partner dashboard access.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Added: Partner registration page',
    type: 'feature',
    description:
      'Added a direct partner registration page at `/partner/register` with account-owner and business-profile sections.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Added: Partner state and city capture',
    type: 'feature',
    description:
      'Added state and city capture to partner registration and partner business-profile completion, with mandatory India state selection and mandatory city validation.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Added: Administrator partner assignment for customers',
    type: 'feature',
    description:
      'Added administrator-controlled partner assignment for customers using a dedicated partner-customer relationship table and searchable partner selector in the customer edit form.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Added: Administrator partner management',
    type: 'feature',
    description:
      'Added administrator partner management with a Partners menu, partner list, edit form for personal and business details, and partner impersonation support.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Added: Partner-scoped customer management',
    type: 'feature',
    description:
      'Added partner-scoped customer management so partners can view assigned customers, log in as assigned customers, flush cache, and update only name, email, mobile number, and password.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Added: Read-only partner Subscription and Customer Add-ons menus',
    type: 'feature',
    description:
      "Added read-only partner Subscription and Customer Add-ons menus so partners can review assigned customers' subscriptions and add-ons without creating, upgrading, assigning, or editing them.",
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Added: Read-only partner Message Billing menu',
    type: 'feature',
    description:
      'Added a read-only partner Message Billing menu so partners can review message billing history only for customers assigned to them.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Added: Campaign v2 log cleanup worker',
    type: 'feature',
    description:
      'Added a nightly Campaign v2 log cleanup worker with dry-run support, retention controls, batch limits, MySQL locking, and run-audit records for operational campaign logs.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Added: Contact book duplicate phone cleanup workflow',
    type: 'feature',
    description:
      'Added a contact book duplicate phone cleanup workflow that lets customers select multiple contact books, preview duplicate phone numbers, and remove duplicate book memberships while keeping the oldest active occurrence.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Added: Contacts Excel export',
    type: 'feature',
    description:
      'Added Excel export for Contacts, including all-contact export from the contact book list and contact-book scoped export from inside a selected book.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Added: Sender-scoped message blacklist management',
    type: 'feature',
    description:
      'Added sender-scoped message blacklist management under Contacts, including single number add, bulk paste, search, deactivate, restore, Redis-backed checks, and send-path blocking before Meta delivery.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Added: Flow Builder add-on assignment',
    type: 'feature',
    description:
      'Added Flow Builder add-on `103`, seeded as `Flow Builder`, so administrators can assign Flow Builder access per WhatsApp sender number.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Added: Orders > Payment Gateways Dynamic UPI onboarding',
    type: 'feature',
    description:
      'Added Orders > Payment Gateways for sender-scoped Dynamic UPI intent gateway onboarding with encrypted credentials, default gateway selection, and validation for VPA, HTTPS intent URL, MCC, and active duplicate names.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Changed: Contact book duplicate-selection behavior',
    type: 'improvement',
    description:
      'Updated the contact book page so row selection is only enabled after activating Check Duplicate mode; normal row clicks continue opening contact books by default.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Changed: Contacts sidebar grouping',
    type: 'improvement',
    description:
      'Converted the Contacts sidebar item into a group with Contact Books and Blacklist entries.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Changed: Blacklist page entry flow',
    type: 'improvement',
    description:
      'Reworked the Blacklist page to match the contact book header/action pattern, moved single-number entry into a modal, and moved bulk copy-paste entry into a dedicated sub-page.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Changed: Flow Builder access warning',
    type: 'improvement',
    description:
      'Flow Builder now remains visible in the menu, but customers without add-on `103` for the selected WhatsApp number see an access warning instead of the flow list/editor.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Changed: Partner Dashboard sidebar position and summary counts',
    type: 'improvement',
    description:
      'Moved the Partner Dashboard menu item to the first sidebar position and added responsive dashboard summary counts for assigned customers, active add-ons, and inactive add-ons.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Changed: Legacy Standard WhatsApp user fields',
    type: 'improvement',
    description:
      'Removed legacy `users` table field usage for the discontinued Standard WhatsApp integration from modern Whats91 customer, partner, registration, and template-library flows.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Fixed: Blacklist table source badge overflow',
    type: 'fix',
    description:
      'Fixed Blacklist table source badges overflowing into the updated-date column by constraining long source labels and widening responsive table columns.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Fixed: Partner Customer Add-ons collation lookup',
    type: 'fix',
    description:
      'Fixed partner Customer Add-ons scope lookup failing when add-on scope UID columns and Cloud API setup UID columns use different MySQL collations.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Fixed: WhatsApp reconnect and replace loop',
    type: 'fix',
    description:
      'Fixed WhatsApp reconnect/replace looping when Meta assigns a new phone-number ID/WABA to the same E.164 number; Replace now archives the old setup and activates the new Meta identity.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Fixed: Template cleanup after WhatsApp number replacement',
    type: 'fix',
    description:
      'Fixed template cleanup after WhatsApp number replacement by detaching old-number templates from the active sender context and skipping invalid Meta delete calls for stale WABA/HSM IDs.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Removed: Administrator Cloud API setup comparison page',
    type: 'breaking',
    description:
      'Removed the administrator Cloud API setup comparison page and backend report endpoints because the legacy database comparison workflow is no longer needed.',
  },
  {
    date: '2026-06-05',
    version: '1.0.1',
    title: 'Removed: Legacy users table fields',
    type: 'breaking',
    description:
      'Added a database cleanup migration to drop legacy `users` columns: `session_count`, `sms_min_count`, `whatsapp_type`, `demo_period`, and `sms_count`.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Initial stable release: Whats91 platform baseline',
    type: 'feature',
    description:
      'The first Whats91 changelog baseline, covering the current customer workspace, WhatsApp Cloud API workflows, automation, reporting, billing, and developer tooling.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'WhatsApp Cloud phone-number management',
    type: 'feature',
    description:
      'Connect and manage WhatsApp Cloud API phone numbers from the customer workspace.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Template and Meta library management',
    type: 'feature',
    description:
      'Maintain templates, carousel templates, Meta library imports, and reusable template parameter presets.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'WhatsApp setup diagnostics',
    type: 'feature',
    description:
      'Review phone-number webhook state, business profile information, session health, and setup diagnostics.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Campaign source selection',
    type: 'feature',
    description:
      'Create campaigns from contact books, CSV/Excel imports, manual numbers, and conversations.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Campaign mapping, testing, scheduling, and throttling',
    type: 'feature',
    description:
      'Use template mapping, source-specific inputs, test sends, scheduling, retries, opt-out controls, and throttle settings.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Campaign delivery and response reports',
    type: 'feature',
    description:
      'View campaign reports, response reports, unsubscribe reports, and customer-friendly delivery summaries.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Outbound, inbound, raw-event, and analytics reports',
    type: 'feature',
    description:
      'Track outbound messages, received messages, raw events, and WhatsApp analytics in separate report views.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Report filters, counters, history, and exports',
    type: 'feature',
    description:
      'Use status counters, filtering, message history, exports, and campaign delivery breakdowns.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Message state audit coverage',
    type: 'feature',
    description:
      'Audit accepted, sent, delivered, read, failed, pending, and reached message states.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Contact books and audience fields',
    type: 'feature',
    description:
      'Manage contact books, contacts, custom fields, grid imports, CSV/Excel uploads, and date field compatibility.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Contact import mapping and validation',
    type: 'feature',
    description:
      'Map columns, validate phone numbers, preview import data, and maintain custom contact attributes.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Chatbot, AI MetaBot, labels, teams, and departments',
    type: 'feature',
    description:
      'Build chatbots, chat shortcuts, AI MetaBot workflows, labels, teams, departments, and chat redirect access.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Flow Builder library, validation, drafts, and testing',
    type: 'feature',
    description:
      'Use the Flow Builder with flow library imports, validation, draft editing, media assets, and WhatsApp-style testing.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Flow Builder node automation',
    type: 'feature',
    description:
      'Design node-based automation flows with triggers, messages, waits, actions, conditions, and validation.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Flow Builder sample imports and draft tests',
    type: 'feature',
    description:
      'Create flows from administrator-managed library samples and test draft flows without sending live WhatsApp messages.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Media, Busy templates, and file-template mapping',
    type: 'feature',
    description:
      'Manage reusable media, Busy template documentation, Busy software API setup, and file-template mapping.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Busy PDF and text workflow support',
    type: 'feature',
    description:
      'Support PDF and text Busy formats, screenshot previews, and file-based campaign/template workflows.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Message billing, wallet, subscription, and add-on review',
    type: 'feature',
    description:
      'Review message billing, wallet history, subscription access, add-ons, and plan-gated capabilities.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Administrator billing and WhatsApp cost tools',
    type: 'feature',
    description:
      'Use administrator billing tools for pricing, wallet management, message billing gaps, and WhatsApp cost reporting.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Developer public API tokens and REST documentation',
    type: 'feature',
    description:
      'Manage public API tokens, REST API documentation, live logger streams, and public sendtemplate integrations.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Miracle and Busy-compatible integrations',
    type: 'feature',
    description:
      'Use custom integrations such as Miracle and Busy-compatible APIs for external software workflows.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Webhook, department, team, label, and workspace settings',
    type: 'feature',
    description:
      'Configure webhooks, departments, team members, chat labels, Google Workspace, Google Sheets, and Google Drive.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Maintenance, cache, phone-number context, and health views',
    type: 'feature',
    description:
      'Use maintenance mode, cache controls, phone-number context, and operational health views.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'WA groups, catalogs, products, orders, and diagnostics',
    type: 'feature',
    description:
      'Operate WA groups, catalog management, products, feeds, sync jobs, orders, diagnostics, and analytics where enabled.',
  },
  {
    date: '2026-06-03',
    version: '1.0.0',
    title: 'Administrator users, subscriptions, templates, flows, and Meta tools',
    type: 'feature',
    description:
      'Use administrator tools for users, subscriptions, template library, flow library, Meta system users, and setup comparison.',
  },
]

// ---------------------------------------------------------------------------
// Table of contents helper
// ---------------------------------------------------------------------------

export interface TocItem {
  id: string
  title: string
  level: number
}

export function tocData(sectionId: string): TocItem[] {
  const section = docSections.find((s) => s.id === sectionId)
  if (!section) return []

  const items: TocItem[] = []
  let counter = 0

  for (const block of section.content) {
    if (block.type === 'heading' && block.level && block.text) {
      counter++
      const slug = block.text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      items.push({
        id: `${slug}-${counter}`,
        title: block.text,
        level: block.level,
      })
    }
  }

  return items
}

// ---------------------------------------------------------------------------
// Search helper — search across all sections
// ---------------------------------------------------------------------------

export interface SearchResult {
  sectionId: string
  sectionTitle: string
  category: string
  canonicalPath?: string
  match: string
}

export interface SearchIndexEntry {
  sectionId: string
  sectionTitle: string
  category: string
  categoryLabel: string
  description: string
  content: string
}

export function searchDocs(query: string): SearchResult[] {
  if (!query.trim()) return []

  const q = query.toLowerCase()
  const results: SearchResult[] = []

  for (const section of docSections) {
    // Check title
    if (section.title.toLowerCase().includes(q)) {
      results.push({
        sectionId: section.id,
        sectionTitle: section.title,
        category: section.category,
        match: section.title,
      })
      continue
    }

    // Check description
    if (section.description.toLowerCase().includes(q)) {
      results.push({
        sectionId: section.id,
        sectionTitle: section.title,
        category: section.category,
        match: section.description,
      })
      continue
    }

    // Check content text
    for (const block of section.content) {
      if (block.text && block.text.toLowerCase().includes(q)) {
        results.push({
          sectionId: section.id,
          sectionTitle: section.title,
          category: section.category,
          match: block.text.substring(0, 120),
        })
        break
      }
      if (block.items) {
        for (const item of block.items) {
          if (item.toLowerCase().includes(q)) {
            results.push({
              sectionId: section.id,
              sectionTitle: section.title,
              category: section.category,
              match: item.substring(0, 120),
            })
            break
          }
        }
        if (results.some((r) => r.sectionId === section.id)) break
      }
    }
  }

  return results
}

export function getFirstApiBlock(section: DocSectionData): ContentBlock | null {
  return section.content.find((block) => block.type === 'api' && block.endpoint) ?? null
}

export function isApiSection(section: DocSectionData): boolean {
  return Boolean(getFirstApiBlock(section))
}

export function getRelatedSectionsForSection(sectionId: string, limit = 4): DocSectionData[] {
  const section = getSectionById(sectionId)
  if (!section || section.category === 'changelog') {
    return []
  }

  const explicitIds = getExplicitRelatedSectionIds(section) ?? defaultRelatedSectionIds(section)
  const related = explicitIds
    .map((id) => getSectionById(id))
    .filter((item): item is DocSectionData => Boolean(item))
    .filter((item) => item.id !== section.id)

  return related.slice(0, limit)
}

export function getSectionSummary(section: DocSectionData): string {
  return section.summary ?? sectionEnhancements[section.id]?.summary ?? section.description
}

export function getSectionPrerequisites(section: DocSectionData): string[] {
  if (section.prerequisites) return section.prerequisites
  const enhanced = sectionEnhancements[section.id]?.prerequisites
  if (enhanced) return enhanced
  if (isApiSection(section)) return ['Authorization: Bearer w91_live_xxx', 'Content-Type: application/json for JSON requests']
  if (section.category === 'getting-started') return ['A Whats91 account']
  return ['A Whats91 account', 'A generated public API token']
}

export function getSectionFaqs(section: DocSectionData): DocFaq[] {
  return section.faqs ?? sectionEnhancements[section.id]?.faqs ?? []
}

export function getSeoTitleForSection(section: DocSectionData): string | undefined {
  return section.seoTitle ?? sectionEnhancements[section.id]?.seoTitle
}

export function getSeoDescriptionForSection(section: DocSectionData): string | undefined {
  return section.seoDescription ?? sectionEnhancements[section.id]?.seoDescription
}

export function getExplicitRelatedSectionIds(section: DocSectionData): string[] | undefined {
  return section.relatedSectionIds ?? sectionEnhancements[section.id]?.relatedSectionIds
}

function defaultRelatedSectionIds(section: DocSectionData): string[] {
  const category = getCategoryForSection(section.id)
  const sameCategoryIds = category?.sections
    .map((item) => item.id)
    .filter((id) => id !== section.id) ?? []

  const topicClusters: Record<string, string[]> = {
    messaging: ['template-marketing', 'reports-all', 'webhook-create'],
    'messaging-meta': ['messaging-template-send', 'reports-all', 'webhook-examples'],
    template: ['messaging-template-send', 'webhook-create', 'reports-template-analytics'],
    webhook: ['messaging-chat-text', 'reports-message-status', 'conversations-list'],
    reports: ['messaging-template-send', 'webhook-samples', 'billing-user-history'],
    'message-billing': ['reports-all', 'reports-delivery-analytics', 'messaging-template-send'],
    chatbot: ['messaging-chat-interactive', 'webhook-examples', 'reports-all'],
    'contact-book': ['messaging-template-send', 'blacklist-list', 'reports-mobile-history'],
    blacklist: ['messaging-chat-text', 'contact-book-list', 'reports-message-status'],
    conversations: ['reports-all', 'webhook-samples', 'messaging-chat-text'],
    crm: ['contact-book-create', 'webhook-examples', 'conversations-list'],
  }

  return [...sameCategoryIds, ...(topicClusters[section.category] ?? [])]
}

export function getSdkExamplesForSection(section: DocSectionData): CodeBlock[] {
  const apiBlock = getFirstApiBlock(section)
  if (!apiBlock?.endpoint) return []

  const method = apiBlock.method ?? 'GET'
  const endpoint = apiBlock.endpoint
  const url = `https://graph.whats91.com${endpoint}`
  const requestBody = extractRequestBody(apiBlock)
  const hasBody = method !== 'GET' && method !== 'DELETE' && requestBody !== null

  const jsonBody = hasBody ? JSON.stringify(requestBody, null, 2) : null

  return [
    {
      language: 'curl',
      label: 'cURL',
      code: jsonBody
        ? `curl -X ${method} "${url}" \\
  -H "Authorization: Bearer w91_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '${jsonBody}'`
        : `curl -X ${method} "${url}" \\
  -H "Authorization: Bearer w91_live_xxx"`,
    },
    {
      language: 'javascript',
      label: 'Node.js',
      code: `const response = await fetch("${url}", {
  method: "${method}",
  headers: {
    "Authorization": "Bearer w91_live_xxx"${jsonBody ? `,
    "Content-Type": "application/json"` : ''}
  }${jsonBody ? `,
  body: JSON.stringify(${indentLines(jsonBody, 2)})` : ''}
});

const data = await response.json();
console.log(data);`,
    },
    {
      language: 'php',
      label: 'PHP',
      code: `$ch = curl_init("${url}");
curl_setopt_array($ch, [
  CURLOPT_CUSTOMREQUEST => "${method}",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer w91_live_xxx"${jsonBody ? `,
    "Content-Type: application/json"` : ''}
  ]${hasBody ? `,
  CURLOPT_POSTFIELDS => json_encode(${toPhpLiteral(requestBody, '  ')})` : ''}
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
    },
    {
      language: 'python',
      label: 'Python',
      code: `import requests

response = requests.request(
    "${method}",
    "${url}",
    headers={
        "Authorization": "Bearer w91_live_xxx"${jsonBody ? `,
        "Content-Type": "application/json"` : ''},
    }${hasBody ? `,
    json=${toPythonLiteral(requestBody, '    ')}` : ''}
)

print(response.json())`,
    },
    {
      language: 'csharp',
      label: 'C#',
      code: `${jsonBody ? `using System.Text;

` : ''}using var client = new HttpClient();
client.DefaultRequestHeaders.Add("Authorization", "Bearer w91_live_xxx");

var request = new HttpRequestMessage(HttpMethod.${methodTitle(method)}, "${url}");${jsonBody ? `
request.Content = new StringContent(
  """
${indentLines(jsonBody, 2, true)}
  """,
  Encoding.UTF8,
  "application/json"
);` : ''}

var response = await client.SendAsync(request);
Console.WriteLine(await response.Content.ReadAsStringAsync());`,
    },
  ]
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

// Returns the request body as parsed JSON. Sources, in order: an explicit JSON
// request block, then the JSON payload inside a documented curl -d flag. Returns
// null when the endpoint documents no parseable JSON body, so SDK examples never
// embed one language's source inside another's request body.
function extractRequestBody(apiBlock: ContentBlock): JsonValue | null {
  const jsonRequest = apiBlock.request?.find((block) => block.language === 'json')
  const parsedJsonBlock = tryParseJson(jsonRequest?.code)
  if (parsedJsonBlock !== undefined) return parsedJsonBlock

  const curlRequest = apiBlock.request?.find(
    (block) => block.language === 'curl' || block.language === 'bash'
  )
  const curlPayload = curlRequest?.code.match(/(?:--data-raw|--data|-d)\s+'([\s\S]*?)'/)?.[1]
  const parsedCurlBody = tryParseJson(curlPayload)
  if (parsedCurlBody !== undefined) return parsedCurlBody

  return null
}

function tryParseJson(code: string | undefined): JsonValue | undefined {
  if (!code?.trim()) return undefined
  try {
    return JSON.parse(code) as JsonValue
  } catch {
    return undefined
  }
}

function indentLines(text: string, spaces: number, indentFirst = false): string {
  const pad = ' '.repeat(spaces)
  const lines = text.split('\n')
  return lines
    .map((line, index) => (index === 0 && !indentFirst ? line : `${pad}${line}`))
    .join('\n')
}

function toPythonLiteral(value: JsonValue, indent: string): string {
  if (value === null) return 'None'
  if (value === true) return 'True'
  if (value === false) return 'False'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return JSON.stringify(value)
  const childIndent = `${indent}    `
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const items = value.map((item) => `${childIndent}${toPythonLiteral(item, childIndent)}`)
    return `[\n${items.join(',\n')}\n${indent}]`
  }
  const entries = Object.entries(value)
  if (entries.length === 0) return '{}'
  const items = entries.map(
    ([key, item]) => `${childIndent}${JSON.stringify(key)}: ${toPythonLiteral(item, childIndent)}`
  )
  return `{\n${items.join(',\n')}\n${indent}}`
}

function toPhpLiteral(value: JsonValue, indent: string): string {
  if (value === null) return 'null'
  if (value === true) return 'true'
  if (value === false) return 'false'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return JSON.stringify(value)
  const childIndent = `${indent}  `
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const items = value.map((item) => `${childIndent}${toPhpLiteral(item, childIndent)}`)
    return `[\n${items.join(',\n')}\n${indent}]`
  }
  const entries = Object.entries(value)
  if (entries.length === 0) return '(object) []'
  const items = entries.map(
    ([key, item]) => `${childIndent}${JSON.stringify(key)} => ${toPhpLiteral(item, childIndent)}`
  )
  return `[\n${items.join(',\n')}\n${indent}]`
}

function methodTitle(method: NonNullable<ContentBlock['method']>): string {
  const lower = method.toLowerCase()
  return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`
}

export function getSearchIndexEntries(): SearchIndexEntry[] {
  return docSections.map((section) => {
    const category = getCategoryForSection(section.id)
    const faqs = getSectionFaqs(section)

    return {
      sectionId: section.id,
      sectionTitle: section.title,
      category: section.category,
      categoryLabel: category?.label ?? section.category,
      description: section.description,
      content: [
        getSectionSummary(section),
        getSectionPrerequisites(section).join('\n'),
        faqs.map((faq) => `${faq.question}\n${faq.answer}`).join('\n'),
        section.content.map(searchableTextFromBlock).filter(Boolean).join('\n'),
      ].filter(Boolean).join('\n'),
    }
  })
}

function searchableTextFromBlock(block: ContentBlock): string {
  return [
    block.text,
    block.endpoint,
    block.items?.join('\n'),
    block.cards?.map((card) => `${card.title} ${card.value ?? ''} ${card.description}`).join('\n'),
    block.headers?.join(' '),
    block.rows?.flat().join(' '),
    block.parameters?.map((param) => `${param.name} ${param.type} ${param.description}`).join('\n'),
    block.request?.map((item) => item.code).join('\n'),
    block.response?.map((item) => item.code).join('\n'),
  ]
    .filter(Boolean)
    .join('\n')
}

// ---------------------------------------------------------------------------
// Design tokens (for reference in components)
// ---------------------------------------------------------------------------

export const designTokens = {
  brandGreen: '#00d4a4',
  codeBlockBg: '#1c1c1e',
  hairline: '#e5e5e5',
  steelText: '#5a5a5c',
  mutedText: '#888888',
} as const
