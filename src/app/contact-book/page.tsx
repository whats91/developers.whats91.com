import { permanentRedirect } from 'next/navigation'

export default function LegacyContactBookPage() {
  permanentRedirect('/contact-books')
}
