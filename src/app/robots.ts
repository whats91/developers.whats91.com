import type { MetadataRoute } from 'next'

const allowedBots = [
  'Googlebot',
  'Google-Extended',
  'Bingbot',
  'BingPreview',
  'DuckDuckBot',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
]

const disallow = [
  '/login',
  '/dashboard',
  '/admin',
  '/api',
  '/internal',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...allowedBots.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow,
      })),
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
    ],
    sitemap: 'https://developers.whats91.com/sitemap.xml',
  }
}
