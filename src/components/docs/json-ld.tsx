import { buildDocPageSchemas, buildGlobalSchemas } from '@/lib/seo'
import { resolveRoutedDoc } from '@/lib/doc-routes'

interface DocJsonLdProps {
  categorySlug: string
  sectionSlug?: string
}

export function DocJsonLd({ categorySlug, sectionSlug }: DocJsonLdProps) {
  const route = resolveRoutedDoc(categorySlug, sectionSlug)
  const graph = [...buildGlobalSchemas(), ...buildDocPageSchemas(route)]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, '\\u003c'),
      }}
    />
  )
}
