import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { getStaticParamsForCategory, resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

type TemplateSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export function generateStaticParams() {
  return getStaticParamsForCategory('template')
}

export async function generateMetadata({
  params,
}: TemplateSectionPageProps): Promise<Metadata> {
  const { section } = await params
  return buildDocMetadata(resolveRoutedDoc('template', section))
}

export default async function TemplateSectionPage({
  params,
}: TemplateSectionPageProps) {
  const { section } = await params
  const route = resolveRoutedDoc('template', section)
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="template" sectionSlug={section} />
      <DocumentationPage
        initialSectionId={route.section.id}
        initialCategoryId={route.category.id}
      />
    </>
  )
}
