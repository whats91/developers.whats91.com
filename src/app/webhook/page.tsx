import { permanentRedirect } from 'next/navigation'

export default function LegacyWebhookPage() {
  permanentRedirect('/webhooks')
}
