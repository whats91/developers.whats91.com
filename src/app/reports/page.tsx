import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

const route = resolveRoutedDoc('reports')

export const metadata: Metadata = buildDocMetadata(route)

export default function ReportsPage() {
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="reports" />
      <DocumentationPage initialSectionId="reports-all" initialCategoryId="reports" />
    </>
  )
}
