export const dynamic = 'force-static'

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="Whats91 Developer Documentation">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect x="64" y="64" width="1072" height="502" rx="32" fill="#f7fffc" stroke="#d8eee8" stroke-width="2"/>
  <rect x="120" y="128" width="72" height="72" rx="18" fill="#00d4a4"/>
  <text x="156" y="176" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800" fill="#ffffff">91</text>
  <text x="216" y="176" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800" fill="#00a982">Whats91 Developer Documentation</text>
  <text x="120" y="328" font-family="Arial, Helvetica, sans-serif" font-size="66" font-weight="800" fill="#0a0a0a">Build WhatsApp API</text>
  <text x="120" y="402" font-family="Arial, Helvetica, sans-serif" font-size="66" font-weight="800" fill="#0a0a0a">integrations with Whats91</text>
  <text x="120" y="492" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#3f4f4a">Messaging, templates, webhooks, reports,</text>
  <text x="120" y="534" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#3f4f4a">chatbots, contact books, and API docs.</text>
</svg>`

export function GET() {
  return new Response(svg, {
    headers: {
      'content-type': 'image/svg+xml',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  })
}
