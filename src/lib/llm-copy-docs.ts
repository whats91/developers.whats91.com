export type LlmCopyDoc = {
  categoryId: string
  sectionId?: string
  label: string
  path: string
}

const categoryLlmCopyDocs: Record<string, LlmCopyDoc> = {
  messaging: {
    categoryId: 'messaging',
    label: 'Messaging API LLM Guide',
    path: '/llms/messaging.md',
  },
  template: {
    categoryId: 'template',
    label: 'Template API LLM Guide',
    path: '/llms/templates.md',
  },
  webhook: {
    categoryId: 'webhook',
    label: 'Webhook API LLM Guide',
    path: '/llms/webhooks.md',
  },
  reports: {
    categoryId: 'reports',
    label: 'Reports API LLM Guide',
    path: '/llms/reports.md',
  },
  'message-billing': {
    categoryId: 'message-billing',
    label: 'Message Billing API LLM Guide',
    path: '/llms/message-billing.md',
  },
  chatbot: {
    categoryId: 'chatbot',
    label: 'Chatbot API LLM Guide',
    path: '/llms/chatbots.md',
  },
  'contact-book': {
    categoryId: 'contact-book',
    label: 'Contact Book API LLM Guide',
    path: '/llms/contact-books.md',
  },
  blacklist: {
    categoryId: 'blacklist',
    label: 'Blacklist API LLM Guide',
    path: '/llms/blacklist.md',
  },
  conversations: {
    categoryId: 'conversations',
    label: 'Conversations API LLM Guide',
    path: '/llms/conversations.md',
  },
}

const sectionLlmCopyDocs: Record<string, LlmCopyDoc> = {
  'crm-lead-generation': {
    categoryId: 'crm',
    sectionId: 'crm-lead-generation',
    label: 'CRM Lead Generation API LLM Guide',
    path: '/llms/crm-lead-generation.md',
  },
  'crm-complaint-creation': {
    categoryId: 'crm',
    sectionId: 'crm-complaint-creation',
    label: 'CRM Complaint Creation API LLM Guide',
    path: '/llms/crm-complaint-creation.md',
  },
}

export function getLlmCopyDocForSection(sectionId: string): LlmCopyDoc | null {
  return sectionLlmCopyDocs[sectionId] ?? null
}

export function getLlmCopyDocForCategory(categoryId: string): LlmCopyDoc | null {
  return categoryLlmCopyDocs[categoryId] ?? null
}

export function getLlmCopyDocs(): LlmCopyDoc[] {
  return [
    ...Object.values(categoryLlmCopyDocs),
    ...Object.values(sectionLlmCopyDocs),
  ]
}
