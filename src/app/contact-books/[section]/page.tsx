import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocumentationPage } from '@/components/docs/documentation-page'
import { DocJsonLd } from '@/components/docs/json-ld'
import { getStaticParamsForCategory, resolveRoutedDoc } from '@/lib/doc-routes'
import { buildDocMetadata } from '@/lib/seo'

type ContactBookSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export function generateStaticParams() {
  return getStaticParamsForCategory('contact-book')
}

export async function generateMetadata({
  params,
}: ContactBookSectionPageProps): Promise<Metadata> {
  const { section } = await params
  return buildDocMetadata(resolveRoutedDoc('contact-book', section))
}

export default async function ContactBookSectionPage({
  params,
}: ContactBookSectionPageProps) {
  const { section } = await params
  const route = resolveRoutedDoc('contact-book', section)
  if (!route) notFound()

  return (
    <>
      <DocJsonLd categorySlug="contact-book" sectionSlug={section} />
      <DocumentationPage
        initialSectionId={route.section.id}
        initialCategoryId={route.category.id}
      />
    </>
  )
}
