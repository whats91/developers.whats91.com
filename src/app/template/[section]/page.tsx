import { permanentRedirect } from 'next/navigation'

type LegacyTemplateSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export default async function LegacyTemplateSectionPage({
  params,
}: LegacyTemplateSectionPageProps) {
  const { section } = await params
  permanentRedirect(`/templates/${section}`)
}
