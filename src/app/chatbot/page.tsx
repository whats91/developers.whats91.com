import { permanentRedirect } from 'next/navigation'

export default function LegacyChatbotPage() {
  permanentRedirect('/chatbots')
}
