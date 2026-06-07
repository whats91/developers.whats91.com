import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { getStaticParamsForCategory, resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

type WebhookSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export function generateStaticParams() {
  return getStaticParamsForCategory('webhook')
}

export async function generateMetadata({
  params,
}: WebhookSectionPageProps): Promise<Metadata> {
  const { section } = await params
  return buildDocMetadata(resolveRoutedDoc('webhook', section))
}

export default async function WebhookSectionPage({
  params,
}: WebhookSectionPageProps) {
  const { section } = await params
  const route = resolveRoutedDoc('webhook', section)
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="webhook" sectionSlug={section} />
      <DocumentationPage
        initialSectionId={route.section.id}
        initialCategoryId={route.category.id}
      />
    </>
  )
}
