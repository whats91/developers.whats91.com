import type { MetadataRoute } from 'next'
import { getIndexableDocRoutes } from '@/lib/doc-routes'
import { absoluteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return getIndexableDocRoutes().map((route) => ({
    url: absoluteUrl(route.canonicalPath),
    lastModified: new Date('2026-06-06'),
    changeFrequency: route.category.id === 'changelog' ? 'weekly' : 'monthly',
    priority: route.category.id === 'getting-started' ? 1 : 0.8,
  }))
}
