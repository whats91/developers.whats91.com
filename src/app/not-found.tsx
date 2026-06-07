import type { Metadata } from 'next'
import { NotFoundPage } from '@/components/docs/not-found-page'

export const metadata: Metadata = {
  title: 'Page Not Found | Whats91 Developers',
  description: 'The requested Whats91 developer documentation page could not be found.',
}

export default function NotFound() {
  return <NotFoundPage />
}
