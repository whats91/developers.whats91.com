import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { getStaticParamsForCategory, resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

type BlacklistSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export function generateStaticParams() {
  return getStaticParamsForCategory('blacklist')
}

export async function generateMetadata({
  params,
}: BlacklistSectionPageProps): Promise<Metadata> {
  const { section } = await params
  return buildDocMetadata(resolveRoutedDoc('blacklist', section))
}

export default async function BlacklistSectionPage({
  params,
}: BlacklistSectionPageProps) {
  const { section } = await params
  const route = resolveRoutedDoc('blacklist', section)
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="blacklist" sectionSlug={section} />
      <DocumentationPage
        initialSectionId={route.section.id}
        initialCategoryId={route.category.id}
      />
    </>
  )
}
