import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

const route = resolveRoutedDoc('webhook')

export const metadata: Metadata = buildDocMetadata(route)

export default function WebhooksPage() {
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="webhook" />
      <DocumentationPage initialSectionId="webhook-create" initialCategoryId="webhook" />
    </>
  )
}
