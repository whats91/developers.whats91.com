import { permanentRedirect } from 'next/navigation'

type LegacyContactBookSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export default async function LegacyContactBookSectionPage({
  params,
}: LegacyContactBookSectionPageProps) {
  const { section } = await params
  permanentRedirect(`/contact-books/${section}`)
}
