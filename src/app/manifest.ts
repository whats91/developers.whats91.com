import type { MetadataRoute } from 'next'
import { brandAssets } from '@/lib/brand-assets'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Whats91 Developer Documentation',
    short_name: 'Whats91 Docs',
    description: 'Developer documentation for Whats91 WhatsApp Messaging and API Services.',
    start_url: '/overview',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#45BC96',
    icons: [
      {
        src: brandAssets.icon192,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: brandAssets.icon512,
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: brandAssets.maskableIcon,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
