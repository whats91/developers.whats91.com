import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { getStaticParamsForCategory, resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

type CrmSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export function generateStaticParams() {
  return getStaticParamsForCategory('crm')
}

export async function generateMetadata({
  params,
}: CrmSectionPageProps): Promise<Metadata> {
  const { section } = await params
  return buildDocMetadata(resolveRoutedDoc('crm', section))
}

export default async function CrmSectionPage({
  params,
}: CrmSectionPageProps) {
  const { section } = await params
  const route = resolveRoutedDoc('crm', section)
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="crm" sectionSlug={section} />
      <DocumentationPage
        initialSectionId={route.section.id}
        initialCategoryId={route.category.id}
      />
    </>
  )
}
