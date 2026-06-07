import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { getStaticParamsForCategory, resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

type ChatbotSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export function generateStaticParams() {
  return getStaticParamsForCategory('chatbot')
}

export async function generateMetadata({
  params,
}: ChatbotSectionPageProps): Promise<Metadata> {
  const { section } = await params
  return buildDocMetadata(resolveRoutedDoc('chatbot', section))
}

export default async function ChatbotSectionPage({
  params,
}: ChatbotSectionPageProps) {
  const { section } = await params
  const route = resolveRoutedDoc('chatbot', section)
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="chatbot" sectionSlug={section} />
      <DocumentationPage
        initialSectionId={route.section.id}
        initialCategoryId={route.category.id}
      />
    </>
  )
}
