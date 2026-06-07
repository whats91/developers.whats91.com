import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Whats91 Developer Documentation'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#ffffff',
          color: '#0a0a0a',
          display: 'flex',
          fontFamily: 'Inter, Arial, sans-serif',
          height: '100%',
          justifyContent: 'center',
          padding: 64,
          width: '100%',
        }}
      >
        <div
          style={{
            background: '#f7fffc',
            border: '2px solid #d8eee8',
            borderRadius: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 30,
            height: '100%',
            justifyContent: 'center',
            padding: 56,
            width: '100%',
          }}
        >
          <div style={{ alignItems: 'center', display: 'flex', gap: 18 }}>
            <div
              style={{
                alignItems: 'center',
                background: '#00d4a4',
                borderRadius: 18,
                color: '#ffffff',
                display: 'flex',
                fontSize: 34,
                fontWeight: 800,
                height: 72,
                justifyContent: 'center',
                width: 72,
              }}
            >
              91
            </div>
            <div style={{ color: '#00a982', fontSize: 34, fontWeight: 800 }}>
              Whats91 Developer Documentation
            </div>
          </div>
          <div style={{ color: '#0a0a0a', fontSize: 66, fontWeight: 800, letterSpacing: 0, lineHeight: 1.05 }}>
            Build WhatsApp API integrations with Whats91
          </div>
          <div style={{ color: '#3f4f4a', fontSize: 30, lineHeight: 1.35, maxWidth: 900 }}>
            Messaging, templates, webhooks, reports, chatbots, contact books, and AI-crawlable API documentation.
          </div>
        </div>
      </div>
    ),
    size,
  )
}
