import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

const route = resolveRoutedDoc('changelog')

export const metadata: Metadata = {
  ...buildDocMetadata(route),
  title: 'Changelog | Whats91 Versions 1.2.0, 1.0.2, 1.0.1, and 1.0.0',
  description:
    'Review Whats91 release notes for Versions 1.2.0, 1.0.2, 1.0.1, and 1.0.0, dated 11 Jun 2026, 06 Jun 2026, 05 Jun 2026, and 03 Jun 2026.',
}

export default function ChangelogRoutePage() {
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="changelog" />
      <DocumentationPage initialSectionId="changelog" initialCategoryId="changelog" />
    </>
  )
}
