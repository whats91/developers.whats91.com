import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

const route = resolveRoutedDoc('blacklist')

export const metadata: Metadata = buildDocMetadata(route)

export default function BlacklistPage() {
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="blacklist" />
      <DocumentationPage initialSectionId="blacklist-list" initialCategoryId="blacklist" />
    </>
  )
}
