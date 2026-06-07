import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

const route = resolveRoutedDoc('message-billing')

export const metadata: Metadata = buildDocMetadata(route)

export default function MessageBillingPage() {
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="message-billing" />
      <DocumentationPage initialSectionId="billing-user-history" initialCategoryId="message-billing" />
    </>
  )
}
