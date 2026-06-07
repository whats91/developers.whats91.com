export type LlmCopyDoc = {
  categoryId: string
  label: string
  path: string
}

const llmCopyDocs: Record<string, LlmCopyDoc> = {
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

export function getLlmCopyDocForCategory(categoryId: string): LlmCopyDoc | null {
  return llmCopyDocs[categoryId] ?? null
}

export function getLlmCopyDocs(): LlmCopyDoc[] {
  return Object.values(llmCopyDocs)
}
