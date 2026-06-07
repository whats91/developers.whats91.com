import { permanentRedirect } from 'next/navigation'

export default function LegacyTemplatePage() {
  permanentRedirect('/templates')
}
