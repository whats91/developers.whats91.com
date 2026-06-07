import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { getStaticParamsForCategory, resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

type MessageBillingSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export function generateStaticParams() {
  return getStaticParamsForCategory('message-billing')
}

export async function generateMetadata({
  params,
}: MessageBillingSectionPageProps): Promise<Metadata> {
  const { section } = await params
  return buildDocMetadata(resolveRoutedDoc('message-billing', section))
}

export default async function MessageBillingSectionPage({
  params,
}: MessageBillingSectionPageProps) {
  const { section } = await params
  const route = resolveRoutedDoc('message-billing', section)
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="message-billing" sectionSlug={section} />
      <DocumentationPage
        initialSectionId={route.section.id}
        initialCategoryId={route.category.id}
      />
    </>
  )
}
