import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { getStaticParamsForCategory, resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

type MessagingSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export function generateStaticParams() {
  return getStaticParamsForCategory('messaging')
}

export async function generateMetadata({
  params,
}: MessagingSectionPageProps): Promise<Metadata> {
  const { section } = await params
  return buildDocMetadata(resolveRoutedDoc('messaging', section))
}

export default async function MessagingSectionPage({
  params,
}: MessagingSectionPageProps) {
  const { section } = await params
  const route = resolveRoutedDoc('messaging', section)
  if (!route) notFound()
  if (route.canonicalPath === route.categoryPath) permanentRedirect(route.categoryPath)

  return (
    <>
      <DocJsonLd categorySlug="messaging" sectionSlug={section} />
      <DocumentationPage
        initialSectionId={route.section.id}
        initialCategoryId={route.category.id}
      />
    </>
  )
}
