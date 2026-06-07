import { permanentRedirect } from 'next/navigation'

type LegacyWebhookSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export default async function LegacyWebhookSectionPage({
  params,
}: LegacyWebhookSectionPageProps) {
  const { section } = await params
  permanentRedirect(`/webhooks/${section}`)
}
