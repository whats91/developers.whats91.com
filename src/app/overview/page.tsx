import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

const route = resolveRoutedDoc('getting-started', 'overview')

export const metadata: Metadata = buildDocMetadata(route)

export default function OverviewPage() {
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="getting-started" sectionSlug="overview" />
      <DocumentationPage initialSectionId="overview" initialCategoryId="getting-started" />
    </>
  )
}
