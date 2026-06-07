import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { getStaticParamsForCategory, resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

type ReportsSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export function generateStaticParams() {
  return getStaticParamsForCategory('reports')
}

export async function generateMetadata({
  params,
}: ReportsSectionPageProps): Promise<Metadata> {
  const { section } = await params
  return buildDocMetadata(resolveRoutedDoc('reports', section))
}

export default async function ReportsSectionPage({
  params,
}: ReportsSectionPageProps) {
  const { section } = await params
  const route = resolveRoutedDoc('reports', section)
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="reports" sectionSlug={section} />
      <DocumentationPage
        initialSectionId={route.section.id}
        initialCategoryId={route.category.id}
      />
    </>
  )
}
