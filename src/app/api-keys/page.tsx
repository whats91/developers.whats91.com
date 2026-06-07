import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

const route = resolveRoutedDoc('getting-started', 'api-keys')

export const metadata: Metadata = buildDocMetadata(route)

export default function ApiKeysPage() {
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="getting-started" sectionSlug="api-keys" />
      <DocumentationPage initialSectionId="api-keys" initialCategoryId="getting-started" />
    </>
  )
}
