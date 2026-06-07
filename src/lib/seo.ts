import type { Metadata } from 'next'
import { brandAssets } from '@/lib/brand-assets'
import {
  getFirstApiBlock,
  getRelatedSectionsForSection,
  getSectionFaqs,
  getSeoDescriptionForSection,
  getSeoTitleForSection,
  isApiSection,
} from '@/lib/doc-data'
import type { DocFaq, DocSectionData } from '@/lib/doc-data'
import type { ResolvedDocRoute } from '@/lib/doc-routes'
import { getPathForSectionId } from '@/lib/doc-routes'

export const SITE_URL = 'https://developers.whats91.com'
export const DOCS_SITE_NAME = 'Whats91 Developers'
const OPEN_GRAPH_IMAGE_PATH = '/opengraph-image'
const TWITTER_IMAGE_PATH = '/twitter-image'

export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildDocMetadata(route: ResolvedDocRoute | null): Metadata {
  if (!route) {
    return {
      title: 'Whats91 Developer Documentation',
      description: 'Whats91 API documentation for WhatsApp messaging integrations.',
      robots: { index: false, follow: true },
    }
  }

  const title = buildTitle(route)
  const description = getSeoDescriptionForSection(route.section) ?? route.section.description
  const canonical = route.canonicalPath
  const url = absoluteUrl(canonical)
  const openGraphImage = absoluteUrl(OPEN_GRAPH_IMAGE_PATH)
  const twitterImage = absoluteUrl(TWITTER_IMAGE_PATH)

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: DOCS_SITE_NAME,
      type: 'article',
      images: [
        {
          url: openGraphImage,
          width: 1200,
          height: 630,
          alt: 'Whats91 developer documentation',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [twitterImage],
    },
  }
}

function buildTitle(route: ResolvedDocRoute): string {
  const seoTitle = getSeoTitleForSection(route.section)
  if (seoTitle) return seoTitle
  if (route.category.id === 'getting-started') {
    return `${route.section.title} | Whats91 Developer Documentation`
  }
  if (route.category.id === 'changelog') {
    return 'Changelog | Whats91 Developer Documentation'
  }

  return `${route.section.title} | ${route.category.label} API Documentation | Whats91 Developers`
}

export function buildGlobalSchemas() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Whats91',
      url: 'https://whats91.com',
      logo: absoluteUrl(brandAssets.wordmark),
      contactPoint: {
        '@type': 'ContactPoint',
        url: 'https://whats91.com/contact',
        contactType: 'customer support',
      },
      sameAs: [
        'https://whats91.com/about',
        'https://whats91.com/blog',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: DOCS_SITE_NAME,
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/search?query={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#software-application`,
      name: 'Whats91 Platform',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: 'https://whats91.com',
      description: 'Whats91 is a WhatsApp Business API platform for messaging, templates, webhooks, chatbots, reports, and billing workflows.',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ]
}

export function buildDocPageSchemas(route: ResolvedDocRoute | null) {
  if (!route) return []

  const pageUrl = absoluteUrl(route.canonicalPath)
  const relatedSections = getRelatedSectionsForSection(route.section.id)
  const faqs = getSectionFaqs(route.section)
  const schemas: Record<string, unknown>[] = [
    buildBreadcrumbSchema(route),
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      '@id': `${pageUrl}#article`,
      headline: route.section.title,
      description: getSeoDescriptionForSection(route.section) ?? route.section.description,
      url: pageUrl,
      about: route.category.label,
      publisher: { '@id': `${SITE_URL}/#organization` },
      isPartOf: { '@id': `${SITE_URL}/#website` },
      mainEntityOfPage: pageUrl,
      relatedLink: relatedSections
        .map((section) => getPathForSectionId(section.id))
        .filter((path): path is string => Boolean(path))
        .map((path) => absoluteUrl(path)),
    },
  ]

  if (isApiSection(route.section)) {
    schemas.push(buildApiReferenceSchema(route.section, pageUrl))
  }

  if (faqs.length > 0) {
    schemas.push(buildFaqSchema(faqs, pageUrl))
  }

  return schemas
}

function buildBreadcrumbSchema(route: ResolvedDocRoute) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Documentation',
      item: absoluteUrl('/overview'),
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: route.category.label,
      item: absoluteUrl(route.categoryPath),
    },
  ]

  if (route.canonicalPath !== route.categoryPath) {
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: route.section.title,
      item: absoluteUrl(route.canonicalPath),
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

function buildApiReferenceSchema(section: DocSectionData, pageUrl: string) {
  const apiBlock = getFirstApiBlock(section)

  return {
    '@context': 'https://schema.org',
    '@type': 'APIReference',
    '@id': `${pageUrl}#api-reference`,
    name: section.title,
    description: section.description,
    url: pageUrl,
    programmingLanguage: 'HTTP',
    targetProduct: {
      '@type': 'SoftwareApplication',
      name: 'Whats91 API Platform',
    },
    entryPoint: apiBlock?.endpoint
      ? {
          '@type': 'EntryPoint',
          httpMethod: apiBlock.method ?? 'GET',
          urlTemplate: `https://graph.whats91.com${apiBlock.endpoint}`,
        }
      : undefined,
  }
}

function buildFaqSchema(faqs: DocFaq[], pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
