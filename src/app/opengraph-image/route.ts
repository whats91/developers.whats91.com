export const dynamic = 'force-static'

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="Whats91 Developer Documentation">
  <rect width="1200" height="630" fill="#f7fffc"/>
  <rect x="64" y="64" width="1072" height="502" rx="32" fill="#ffffff" stroke="#d8eee8" stroke-width="2"/>
  <rect x="120" y="128" width="72" height="72" rx="18" fill="#00d4a4"/>
  <text x="156" y="176" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800" fill="#ffffff">91</text>
  <text x="216" y="158" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800" fill="#00a982">Whats91</text>
  <text x="216" y="192" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#5a5a5c">Developer Platform</text>
  <text x="120" y="318" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="800" fill="#0a0a0a">Whats91 Developer</text>
  <text x="120" y="392" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="800" fill="#0a0a0a">Documentation</text>
  <text x="120" y="468" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#3f4f4a">WhatsApp API guides for messaging, templates,</text>
  <text x="120" y="510" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#3f4f4a">webhooks, reports, chatbots, and integrations.</text>
</svg>`

export function GET() {
  return new Response(svg, {
    headers: {
      'content-type': 'image/svg+xml',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  })
}
