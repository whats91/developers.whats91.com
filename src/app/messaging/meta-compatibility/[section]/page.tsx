import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { getStaticParamsForCategory, resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

type MessagingMetaSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export function generateStaticParams() {
  return getStaticParamsForCategory('messaging-meta')
}

export async function generateMetadata({
  params,
}: MessagingMetaSectionPageProps): Promise<Metadata> {
  const { section } = await params
  return buildDocMetadata(resolveRoutedDoc('messaging-meta', section))
}

export default async function MessagingMetaSectionPage({
  params,
}: MessagingMetaSectionPageProps) {
  const { section } = await params
  const route = resolveRoutedDoc('messaging-meta', section)
  if (!route) notFound()
  if (route.canonicalPath === route.categoryPath) permanentRedirect(route.categoryPath)

  return (
    <>
      <DocJsonLd categorySlug="messaging-meta" sectionSlug={section} />
      <DocumentationPage
        initialSectionId={route.section.id}
        initialCategoryId={route.category.id}
      />
    </>
  )
}
