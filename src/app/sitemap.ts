import type { MetadataRoute } from 'next'
import { getIndexableDocRoutes } from '@/lib/doc-routes'
import { changelogEntries } from '@/lib/doc-data'
import { absoluteUrl } from '@/lib/seo'

// The changelog is the only page with a verifiable modification date: the date
// of its most recent release entry. Other documentation pages omit lastModified
// rather than advertising a date that cannot be tied to a real content change.
const latestChangelogDate = changelogEntries
  .map((entry) => entry.date)
  .sort()
  .at(-1)

export default function sitemap(): MetadataRoute.Sitemap {
  return getIndexableDocRoutes().map((route) => ({
    url: absoluteUrl(route.canonicalPath),
    lastModified:
      route.category.id === 'changelog' && latestChangelogDate
        ? new Date(latestChangelogDate)
        : undefined,
    changeFrequency: route.category.id === 'changelog' ? 'weekly' : 'monthly',
    priority: route.category.id === 'getting-started' ? 1 : 0.8,
  }))
}
