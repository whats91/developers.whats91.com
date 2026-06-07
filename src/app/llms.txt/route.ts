import { getIndexableDocRoutes } from '@/lib/doc-routes'
import { getLlmCopyDocs } from '@/lib/llm-copy-docs'
import { absoluteUrl } from '@/lib/seo'

export function GET() {
  const prioritySections = [
    ['Overview', '/overview'],
    ['Quick Start', '/quickstart'],
    ['Authentication', '/authentication'],
    ['Messaging APIs', '/messaging'],
    ['Templates APIs', '/templates'],
    ['Webhooks APIs', '/webhooks'],
    ['Chatbots APIs', '/chatbots'],
    ['Reports APIs', '/reports'],
    ['Billing APIs', '/message-billing'],
    ['Conversations APIs', '/conversations'],
    ['Changelog', '/changelog'],
  ]

  const routeLines = getIndexableDocRoutes()
    .map((route) => `- [${route.category.label}: ${route.section.title}](${absoluteUrl(route.canonicalPath)}) - ${route.section.description}`)
    .join('\n')
  const additionalLlmGuideLines = getLlmCopyDocs()
    .filter((doc) => doc.path !== '/llms/messaging.md')
    .map((doc) => `- [${doc.label}](${absoluteUrl(doc.path)}) - Copy-ready Markdown for LLM implementation and debugging context.`)
    .join('\n')
  const llmGuideLines = [
    `- [Messaging API LLM Guide](${absoluteUrl('/llms/messaging.md')}) - Copy-ready Markdown for Whats91 Messaging API implementation and debugging context.`,
    additionalLlmGuideLines,
  ].filter(Boolean).join('\n')

  const body = `# Whats91 Developer Documentation

Whats91 API documentation for WhatsApp messaging, template creation, webhooks, chatbots, reports, billing, contact books, blacklists, and conversations.

## Primary Documentation Areas

${prioritySections.map(([label, path]) => `- [${label}](${absoluteUrl(path)})`).join('\n')}

## Copy-Ready LLM Guides

${llmGuideLines}

## Index

${routeLines}
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
