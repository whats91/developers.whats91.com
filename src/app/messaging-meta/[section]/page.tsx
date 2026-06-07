import { permanentRedirect } from 'next/navigation'

type LegacyMessagingMetaSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export default async function LegacyMessagingMetaSectionPage({
  params,
}: LegacyMessagingMetaSectionPageProps) {
  const { section } = await params
  permanentRedirect(`/messaging/meta-compatibility/${section}`)
}
