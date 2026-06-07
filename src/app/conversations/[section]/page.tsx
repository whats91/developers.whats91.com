import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { getStaticParamsForCategory, resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

type ConversationsSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export function generateStaticParams() {
  return getStaticParamsForCategory('conversations')
}

export async function generateMetadata({
  params,
}: ConversationsSectionPageProps): Promise<Metadata> {
  const { section } = await params
  return buildDocMetadata(resolveRoutedDoc('conversations', section))
}

export default async function ConversationsSectionPage({
  params,
}: ConversationsSectionPageProps) {
  const { section } = await params
  const route = resolveRoutedDoc('conversations', section)
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="conversations" sectionSlug={section} />
      <DocumentationPage
        initialSectionId={route.section.id}
        initialCategoryId={route.category.id}
      />
    </>
  )
}
