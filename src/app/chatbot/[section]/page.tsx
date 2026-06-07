import { permanentRedirect } from 'next/navigation'

type LegacyChatbotSectionPageProps = {
  params: Promise<{
    section: string
  }>
}

export default async function LegacyChatbotSectionPage({
  params,
}: LegacyChatbotSectionPageProps) {
  const { section } = await params
  permanentRedirect(`/chatbots/${section}`)
}
