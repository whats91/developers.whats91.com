import { permanentRedirect } from 'next/navigation'

export default function LegacyMessagingMetaPage() {
  permanentRedirect('/messaging/meta-compatibility')
}
