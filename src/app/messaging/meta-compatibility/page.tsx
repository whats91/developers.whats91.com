import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

const route = resolveRoutedDoc('messaging-meta')

export const metadata: Metadata = buildDocMetadata(route)

export default function MessagingMetaCompatibilityPage() {
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="messaging-meta" />
      <DocumentationPage initialSectionId="messaging-meta-overview" initialCategoryId="messaging-meta" />
    </>
  )
}
